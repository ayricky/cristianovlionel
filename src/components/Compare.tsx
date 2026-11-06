import { useMemo, useState } from 'react'
import { ALL, compare, opponents, type Filter } from '../lib/compare'
import { Rows, type Stat } from './Bits'
import { Trend } from './Trend'

const PRESETS: [string, Partial<Filter>][] = [
  ['Everything', {}],
  ['Champions League knockouts', { comp: 'ucl', stage: 'ko' }],
  ['Semi-finals and finals', { stage: 'late' }],
  ['World Cups', { comp: 'worldcup' }],
  ['Competitive internationals', { comp: 'competitive' }],
  ['After 30', { from: 30 }],
  ['Level or behind, no penalties', { close: true, noPens: true }],
]
const AGES = Array.from({ length: 25 }, (_, i) => 17 + i)
const div = (a: number, b: number, d = 2) => (b ? (a / b).toFixed(d) : '0')

export function Compare() {
  const [f, setF] = useState<Filter>(ALL)
  const set = (p: Partial<Filter>) => setF((x) => ({ ...x, ...p }))
  const names = useMemo(opponents, [])
  const a = useMemo(() => compare('ronaldo', f), [f])
  const b = useMemo(() => compare('messi', f), [f])
  const rows: Stat[] = [
    { k: 'Games', r: a.games, m: b.games, plain: true },
    { k: 'Goals', r: a.goals, m: b.goals },
    { k: 'Goals per game', r: div(a.goals, a.games), m: div(b.goals, b.games) },
    { k: 'Minutes per goal', r: a.goals ? Math.round(a.mins / a.goals) : 0, m: b.goals ? Math.round(b.mins / b.goals) : 0, low: true },
    { k: 'Assists', r: a.assists, m: b.assists },
    { k: 'Goals and assists per game', r: div(a.goals + a.assists, a.games), m: div(b.goals + b.assists, b.games) },
    { k: 'Match winners', r: a.winners, m: b.winners },
    { k: 'Share level or behind', r: `${a.goals ? Math.round((a.close / a.goals) * 100) : 0}%`, m: `${b.goals ? Math.round((b.close / b.goals) * 100) : 0}%` },
    { k: 'Penalties', r: a.pens, m: b.pens, plain: true },
    { k: 'Hat-tricks', r: a.hats, m: b.hats },
  ]
  const active = (p: Partial<Filter>) => JSON.stringify({ ...ALL, ...p }) === JSON.stringify(f)
  return (
    <div className="compare">
      <div className="presets">
        {PRESETS.map(([k, p]) => <button key={k} className="chip" aria-pressed={active(p)} onClick={() => setF({ ...ALL, ...p })}>{k}</button>)}
      </div>
      <div className="filters">
        <label>Competition
          <select value={f.comp} onChange={(e) => set({ comp: e.target.value as Filter['comp'] })}>
            <option value="all">All</option><option value="league">League</option><option value="ucl">Champions League</option><option value="cups">Other club cups</option><option value="nation">All internationals</option><option value="competitive">Competitive internationals</option><option value="worldcup">World Cup</option>
          </select>
        </label>
        <label>Round
          <select value={f.stage} onChange={(e) => set({ stage: e.target.value as Filter['stage'] })}>
            <option value="all">All</option><option value="ko">Knockouts</option><option value="late">Semi-finals and finals</option>
          </select>
        </label>
        <label>Venue
          <select value={f.venue} onChange={(e) => set({ venue: e.target.value as Filter['venue'] })}>
            <option value="all">All</option><option value="H">Home</option><option value="A">Away</option>
          </select>
        </label>
        <label>From age
          <select value={f.from} onChange={(e) => set({ from: +e.target.value })}>{AGES.map((n) => <option key={n}>{n}</option>)}</select>
        </label>
        <label>To age
          <select value={f.to} onChange={(e) => set({ to: +e.target.value })}>{AGES.map((n) => <option key={n}>{n}</option>)}</select>
        </label>
        <label>Opponent
          <input list="opps" value={f.opp} placeholder="Any" onChange={(e) => set({ opp: e.target.value })} />
          <datalist id="opps">{names.map((n) => <option key={n} value={n} />)}</datalist>
        </label>
        <label className="tick"><input type="checkbox" checked={f.close} onChange={(e) => set({ close: e.target.checked })} /> Level or behind only</label>
        <label className="tick"><input type="checkbox" checked={f.noPens} onChange={(e) => set({ noPens: e.target.checked })} /> No penalties</label>
      </div>
      <div className="compare-out">
        <Rows rows={rows} />
        <Trend a={a} b={b} from={f.from} to={f.to} />
      </div>
    </div>
  )
}
