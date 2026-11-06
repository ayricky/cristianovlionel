import { comps, goals, matches, teams, type Who } from './data'

const BORN: Record<Who, string> = { ronaldo: '1985-02-05', messi: '1987-06-24' }
const LEAGUES = new Set(['La Liga', 'Premier League', 'Primeira Liga', 'Serie A', 'Saudi Pro League', 'Ligue 1', 'MLS'])
const NATIONS = new Set(['Portugal', 'Argentina'])
const KNOCKOUT = new Set(['R96', 'R64', 'R32', 'R16', 'QF', 'SF', 'F'])

export type Comp = 'all' | 'league' | 'ucl' | 'nation' | 'competitive' | 'worldcup' | 'cups'
export type Stage = 'all' | 'ko' | 'late'
export type Venue = 'all' | 'H' | 'A'
export interface Filter { comp: Comp; stage: Stage; venue: Venue; from: number; to: number; opp: string; close: boolean; noPens: boolean }
export const ALL: Filter = { comp: 'all', stage: 'all', venue: 'all', from: 17, to: 41, opp: '', close: false, noPens: false }

export interface Result { games: number; goals: number; assists: number; winners: number; close: number; hats: number; mins: number; pens: number; byAge: number[]; byYear: Map<number, number> }

const ageAt = (w: Who, iso: string) => (Date.parse(iso) - Date.parse(BORN[w])) / (365.25 * 864e5)

/** Recount one player's matches and goals under a filter. Every number here comes from the same logs as the rest of the site. */
export function compare(w: Who, f: Filter): Result {
  const rows = matches(w), comp = comps(w), team = teams(w)
  const opp = f.opp.trim().toLowerCase()
  const keep = new Set<number>()
  let assists = 0, mins = 0
  rows.forEach((x, i) => {
    const name = comp[x[1]], nation = NATIONS.has(team[x[2]])
    const c = f.comp === 'all' || (f.comp === 'league' && LEAGUES.has(name)) || (f.comp === 'ucl' && name === 'Champions League') || (f.comp === 'nation' && nation)
      || (f.comp === 'competitive' && nation && name !== 'International Friendly') || (f.comp === 'worldcup' && name === 'World Cup') || (f.comp === 'cups' && !nation && !LEAGUES.has(name) && name !== 'Champions League')
    const s = f.stage === 'all' || (f.stage === 'ko' && KNOCKOUT.has(x[10])) || (f.stage === 'late' && (x[10] === 'SF' || x[10] === 'F'))
    const v = f.venue === 'all' || x[4] === f.venue
    const a = ageAt(w, x[0])
    if (!c || !s || !v || a < f.from || a >= f.to + 1) return
    if (opp && !x[3].toLowerCase().includes(opp)) return
    keep.add(i); assists += x[8]; mins += x[11]
  })
  const r: Result = { games: keep.size, goals: 0, assists, winners: 0, close: 0, hats: 0, mins, pens: 0, byAge: Array(25).fill(0), byYear: new Map() }
  const perMatch = new Map<number, number>()
  for (const g of goals(w)) {
    if (!keep.has(g[0])) continue
    if (f.noPens && g[4]) continue
    if (f.close && g[3] > 0) continue
    r.goals++
    if (g[4]) r.pens++
    if (g[5]) r.winners++
    if (g[3] <= 0) r.close++
    perMatch.set(g[0], (perMatch.get(g[0]) ?? 0) + 1)
    const iso = rows[g[0]][0]
    r.byAge[Math.min(24, Math.max(0, Math.floor(ageAt(w, iso)) - 17))]++
    const y = +iso.slice(0, 4)
    r.byYear.set(y, (r.byYear.get(y) ?? 0) + 1)
  }
  for (const n of perMatch.values()) if (n >= 3) r.hats++
  return r
}

export const opponents = () => [...new Set([...matches('ronaldo'), ...matches('messi')].map((x) => x[3]))].sort()
