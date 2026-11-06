import { useState } from 'react'
import { P, type Who } from '../lib/data'
import { Rows } from './Bits'

type Zone = 'all' | 'six' | 'head' | 'out' | 'open'
const ZONES: [Zone, string][] = [['all', 'All goals'], ['open', 'No penalties'], ['six', 'Six-yard box'], ['head', 'Headers'], ['out', 'Outside the box']]
const dots = (w: Who, z: Zone) => (P(w).shots as number[][]).filter((s) => {
  if (!s[3]) return false
  const dep = s[0], wide = Math.abs(s[1])
  return z === 'all' || (z === 'open' && s[5] !== 4) || (z === 'six' && dep <= 5.5 && wide <= 9.16) || (z === 'head' && s[4] === 2) || (z === 'out' && (dep > 16.5 || wide > 20.16))
})

function Half({ who, z }: { who: Who; z: Zone }) {
  return (
    <figure className="half">
      <figcaption><i className={`k ${who === 'ronaldo' ? 'r' : 'm'}`} />{who === 'ronaldo' ? 'Ronaldo' : 'Messi'}</figcaption>
      <svg viewBox="-36 -3 72 42" role="img" aria-label={`${who} goal locations`}>
        <g className="lines">
          <rect x="-34" y="0" width="68" height="38" /><rect x="-20.16" y="0" width="40.32" height="16.5" /><rect x="-9.16" y="0" width="18.32" height="5.5" /><rect x="-3.66" y="-1.6" width="7.32" height="1.6" />
          <path d="M-7.3 16.5A9.15 9.15 0 0 0 7.3 16.5" />
        </g>
        {dots(who, z).map((s, i) => <circle key={i} cx={-s[1]} cy={s[0]} r=".62" className={who === 'ronaldo' ? 'dot r' : 'dot m'}><title>{`${s[0].toFixed(0)}m out`}</title></circle>)}
      </svg>
    </figure>
  )
}

export function Pitch() {
  const [z, setZ] = useState<Zone>('all')
  const r = dots('ronaldo', z), m = dots('messi', z)
  const dist = (x: number[][]) => (x.length ? (x.reduce((n, s) => n + Math.hypot(s[0], s[1]), 0) / x.length).toFixed(1) : '0')
  return (
    <div className="pitch">
      <div className="presets">{ZONES.map(([k, t]) => <button key={k} className="chip" aria-pressed={z === k} onClick={() => setZ(k)}>{t}</button>)}</div>
      <div className="pitch-out">
        <div className="halves"><Half who="ronaldo" z={z} /><Half who="messi" z={z} /></div>
        <Rows rows={[{ k: 'League goals shown', r: r.length, m: m.length }, { k: 'Average distance, metres', r: dist(r), m: dist(m), plain: true }]} />
      </div>
      <p className="card-note">Every league goal in England, Spain, Italy and France, 2014-15 to 2022-23, from Understat.</p>
    </div>
  )
}
