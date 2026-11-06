import { useMemo, useState } from 'react'
import { MODELS, SECTIONS, type Section } from '../lib/stats'
import { numeric, Rows, type Stat } from './Bits'

const limit = () => (innerWidth <= 640 ? 4 : 6)
type Lead = 'all' | 'r' | 'm'
const leader = (s: Stat) => { if (s.plain) return ''; const a = numeric(s.r), b = numeric(s.m); return a === b ? '' : (s.low ? a < b : a > b) ? 'r' : 'm' }

function Card({ s, rows, open }: { s: Section; rows: Stat[]; open: boolean }) {
  const [all, setAll] = useState(false)
  const cap = limit()
  const show = open || all ? rows : rows.slice(0, cap)
  return (
    <article className="card">
      <h3>{s.title}</h3>
      <p className="card-line">{s.line}</p>
      <Rows rows={show} />
      {!open && rows.length > cap && <button className="more" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `Show all ${rows.length}`}</button>}
      {s.id === 'messi' && <p className="card-note">{MODELS}</p>}
    </article>
  )
}

export function Scorecards() {
  const [q, setQ] = useState('')
  const [lead, setLead] = useState<Lead>('all')
  const needle = q.trim().toLowerCase()
  const list = useMemo(() => SECTIONS.map((s) => ({ s, rows: s.rows.filter((x) => (!needle || x.k.toLowerCase().includes(needle)) && (lead === 'all' || leader(x) === lead)) })).filter((x) => x.rows.length), [needle, lead])
  const total = list.reduce((n, x) => n + x.rows.length, 0)
  return (
    <>
      <div className="tools">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search stats" aria-label="Search stats" />
        <span className="seg" role="group" aria-label="Show">
          {([['all', 'All'], ['r', 'Ronaldo leads'], ['m', 'Messi leads']] as [Lead, string][]).map(([k, t]) => <button key={k} aria-pressed={lead === k} onClick={() => setLead(k)}>{t}</button>)}
        </span>
        <span className="count">{total} stats</span>
      </div>
      <div className="cards">{list.map(({ s, rows }) => <Card key={s.id} s={s} rows={rows} open={!!needle || lead !== 'all'} />)}</div>
    </>
  )
}
