import { useState } from 'react'
import type { Result } from '../lib/compare'

const W = 620, H = 250, L = 30, R = 62, T = 12, B = 26

/** Goals by age or calendar year for the current filter. */
export function Trend({ a, b, from, to }: { a: Result; b: Result; from: number; to: number }) {
  const [by, setBy] = useState<'age' | 'year'>('age')
  const [hover, setHover] = useState<number | null>(null)
  const xs: number[] = []
  if (by === 'age') for (let n = Math.min(from, to); n <= Math.max(from, to); n++) xs.push(n)
  else { const ys = [...a.byYear.keys(), ...b.byYear.keys()]; const lo = ys.length ? Math.min(...ys) : 2003, hi = ys.length ? Math.max(...ys) : 2026; for (let y = lo; y <= hi; y++) xs.push(y) }
  const val = (r: Result, x: number) => (by === 'age' ? r.byAge[x - 17] ?? 0 : r.byYear.get(x) ?? 0)
  const top = Math.max(4, ...xs.flatMap((x) => [val(a, x), val(b, x)]))
  const cap = Math.ceil(top / 10) * 10 || 10
  const px = (i: number) => L + (xs.length > 1 ? (i / (xs.length - 1)) * (W - L - R) : (W - L - R) / 2)
  const py = (v: number) => T + (1 - v / cap) * (H - T - B)
  const path = (r: Result) => xs.map((x, i) => `${i ? 'L' : 'M'}${px(i).toFixed(1)} ${py(val(r, x)).toFixed(1)}`).join('')
  const grid = [0, cap / 2, cap]
  const every = Math.ceil(xs.length / 8)
  const last = xs.length - 1
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const q = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - q.left) / q.width) * W
    setHover(Math.max(0, Math.min(last, Math.round(((x - L) / (W - L - R)) * last))))
  }
  const h = hover !== null && hover <= last ? hover : null
  return (
    <figure className="trend">
      <figcaption>
        <span className="legend"><i className="k r" />Ronaldo <i className="k m" />Messi</span>
        <span className="seg">Goals by <button aria-pressed={by === 'age'} onClick={() => setBy('age')}>age</button><button aria-pressed={by === 'year'} onClick={() => setBy('year')}>year</button></span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Goals by ${by}, Ronaldo and Messi`} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {grid.map((g) => <g key={g}><line x1={L} x2={W - R} y1={py(g)} y2={py(g)} className="gl" /><text x={L - 6} y={py(g) + 4} textAnchor="end" className="tx">{g}</text></g>)}
        {xs.map((x, i) => i % every === 0 && <text key={x} x={px(i)} y={H - 8} textAnchor="middle" className="tx">{x}</text>)}
        {h !== null && <line x1={px(h)} x2={px(h)} y1={T} y2={H - B} className="cross" />}
        <path d={path(b)} className="ln2 m" /><path d={path(a)} className="ln2 r" />
        {last >= 0 && <><text x={px(last) + 7} y={py(val(a, xs[last])) + 4} className="tx lab">Ronaldo</text><text x={px(last) + 7} y={py(val(b, xs[last])) + (Math.abs(val(a, xs[last]) - val(b, xs[last])) < cap / 14 ? 16 : 4)} className="tx lab">Messi</text></>}
        {h !== null && <><circle cx={px(h)} cy={py(val(a, xs[h]))} r="4" className="pt r" /><circle cx={px(h)} cy={py(val(b, xs[h]))} r="4" className="pt m" /></>}
      </svg>
      <p className="trend-tip">{h !== null ? <>{by === 'age' ? `Age ${xs[h]}` : xs[h]}: Ronaldo {val(a, xs[h])}, Messi {val(b, xs[h])}</> : ' '}</p>
    </figure>
  )
}
