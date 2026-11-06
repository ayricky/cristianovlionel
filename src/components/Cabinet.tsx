import { useState } from 'react'
import { fmtSeason, P, trophies, type Who } from '../lib/data'

const Cup = ({ kind }: { kind: string }) => (
  <svg viewBox="0 0 40 48" aria-hidden className="cup">
    {kind === 'league' ? <path d="M6 5h28v20c0 10-8 16-14 19C14 41 6 35 6 25z" />
      : kind === 'nation' ? <path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1zM13 39h14v5H13z" />
      : kind === 'europe' ? <path d="M12 4h16c0 3 0 6-.5 9 3-3 6-3 8 0 2 4-1 10-10 12-1 3-3 5-3 7v5h5v5H12v-5h5v-5c0-2-2-4-3-7C5 23 2 17 4 13c2-3 5-3 8 0-.5-3-.5-6-.5-9z" />
      : <path d="M11 4h18v12c0 7-4 11-7 12v8h6v6H12v-6h6v-8c-3-1-7-5-7-12z" />}
  </svg>
)
type T = ReturnType<typeof trophies>[number]
function Shelf({ who, pick }: { who: Who; pick: (t: T) => void }) {
  return (
    <div className={`shelf ${who} emptied`}>
      {trophies(who).map((t) => <button key={t.comp + t.season} className={`trophy t-${t.status}`} aria-label={`${t.comp} ${fmtSeason(t.season)}`} onMouseEnter={() => pick(t)} onFocus={() => pick(t)} onClick={() => pick(t)}><Cup kind={t.kind} /></button>)}
    </div>
  )
}
export function Cabinet() {
  const [t, setT] = useState<T | null>(null)
  const c = { r: P('ronaldo').trophyCount, m: P('messi').trophyCount }
  return (
    <div className="cabinet">
      <h3>Trophies that needed his goals</h3>
      <p className="card-line">Dashed trophies are lost without his goals. Point at one to see why.</p>
      <div className="split"><div><p className="count"><i className="k r" />Ronaldo, {c.r.gone} of {c.r.total}</p><Shelf who="ronaldo" pick={setT} /></div><div><p className="count"><i className="k m" />Messi, {c.m.gone} of {c.m.total}</p><Shelf who="messi" pick={setT} /></div></div>
      <p className="detail">{t ? `${t.comp} ${fmtSeason(t.season)}: ${t.why ?? 'Safe without his goals.'}` : '\u00a0'}</p>
    </div>
  )
}
