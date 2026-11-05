import raw from '../data/site.json'

export type Who = 'ronaldo' | 'messi'
export const NAMES: Record<Who, string> = { ronaldo: 'Ronaldo', messi: 'Messi' }

/** One match, flattened in data/pipeline/build.py `compact`. */
export type Row = [iso: string, comp: number, team: number, opp: string, ha: string, t: number, o: number, g: number, a: number, p: number, round: string, mins: number, pen: string]
/** One goal: match index, minute, added time, lead before the goal, penalty flag, winner flag. */
export type GoalRow = [i: number, min: number, add: number, state: number, pen: number, win: number]

export interface Tie { round: string; opp: string; gf: number; ga: number; gf2: number; removed: number; status: string; pen: string | null }
export interface Trophy { comp: string; season: string; team?: string; status: 'gone' | 'doubt' | 'safe'; why: string | null; kind: string; ties: Tie[] }
export interface LeagueSeason {
  comp: string; season: string; team: string; label: string; played: number; of: number; goals: number; pos: number; pos2: number
  pts: number; pts2: number; champion: string; champion2: string; title: boolean; kept: boolean
  before: { team: string; p: number }[]; after: { team: string; p: number }[]
  flipped: { opp: string; iso: string; ha: string; t: number; o: number; g: number; lost: number }[]
}

export const site = raw as unknown as {
  moves: { player: Who; kind: string; team: string; comp: string; a: string; b: string; ptsA: number; ptsB: number; gfA: number; gfB: number; plA: number; plB: number }[]
  h2h: { iso: string; comp: string; team: string; opp: string; t: number; o: number; rg: number; mg: number; ra: number; ma: number }[]
} & Record<Who, any>

export const P = (w: Who) => site[w]
export const matches = (w: Who) => P(w).matches.rows as Row[]
export const goals = (w: Who) => P(w).goals as GoalRow[]
export const comps = (w: Who) => P(w).matches.comps as string[]
export const teams = (w: Who) => P(w).matches.teams as string[]
export const leagues = (w: Who) => (P(w).leagues as LeagueSeason[]).filter((l) => l.title)
export const trophies = (w: Who) => P(w).trophies as Trophy[]

export const res = (a: number, b: number) => (a > b ? 'W' : a === b ? 'D' : 'L')
export const pts = (a: number, b: number) => (a > b ? 3 : a === b ? 1 : 0)

export interface EraseSummary { n: number; flips: number; wins: number; points: number; per100: number }
export function eraseOf(rows: Row[], withAssists = false): EraseSummary {
  let flips = 0, wins = 0, points = 0
  for (const r of rows) {
    const k = r[7] + (withAssists ? r[8] : 0)
    const a = res(r[5], r[6]), b = res(r[5] - k, r[6])
    if (a !== b) flips++
    if (a === 'W' && b !== 'W') wins++
    points += pts(r[5], r[6]) - pts(r[5] - k, r[6])
  }
  return { n: rows.length, flips, wins, points, per100: rows.length ? (points / rows.length) * 100 : 0 }
}

/** Running totals as goals are erased in date order, for the hero counter. */
export function eraseTimeline(w: Who) {
  const rows = matches(w)
  const gs = goals(w)
  const tr = trophies(w).filter((t) => t.status === 'gone').map((t) => t.season.length === 4 ? `${t.season}-12` : `${t.season.slice(5)}-07`).sort()
  const seen = new Map<number, number>()
  let flips = 0, wins = 0, points = 0, t = 0
  return gs.map((g) => {
    const r = rows[g[0]]
    const was = seen.get(g[0]) ?? 0
    const now = was + 1
    seen.set(g[0], now)
    const before = r[5] - was, after = r[5] - now
    const a0 = res(r[5], r[6]), a1 = res(before, r[6]), a2 = res(after, r[6])
    if (a1 === a0 && a2 !== a0) flips++
    if (a0 === 'W' && a1 === 'W' && a2 !== 'W') wins++
    points += pts(before, r[6]) - pts(after, r[6])
    while (t < tr.length && tr[t] <= r[0].slice(0, 7)) t++
    return { flips, wins, points, trophies: t, iso: r[0] }
  })
}

export const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`
export const fmtSeason = (s: string) => (s.length === 4 ? s : `${s.slice(0, 4)}-${s.slice(7)}`)
export const fmtDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
export const shortTeam: Record<string, string> = { 'Manchester United': 'Man United', 'Paris Saint-Germain': 'PSG', 'Ath Madrid': 'Atlético' }
