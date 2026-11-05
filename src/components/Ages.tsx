import { P, type Who } from '../lib/data'
import { Count, useInView } from './Bits'
import { Claim } from './Claim'

const r = P('ronaldo'), m = P('messi')
const X0 = 17, X1 = 42, W = 1000, H = 440
const x = (a: number) => ((a - X0) / (X1 - X0)) * W
const y = (g: number) => H - (g / 1000) * H
const series = (w: Who) => P(w).ageSeries as [number, number][]
const path = (w: Who) => 'M' + series(w).map(([a, g]) => `${x(a).toFixed(1)} ${y(g).toFixed(1)}`).join('L')
const end = (w: Who) => series(w)[series(w).length - 1]

function Race() {
  const [ref, on] = useInView<HTMLDivElement>()
  const rx = end('ronaldo'), mx = end('messi')
  return (
    <div ref={ref} className={`race-line ${on ? 'in' : ''}`}>
      <svg viewBox={`0 0 ${W} ${H + 30}`} role="img" aria-label="Career goals by age for both players">
        <line x1={x(30)} x2={x(30)} y1="0" y2={H} className="thirty" />
        <text x={x(30) - 10} y="24" textAnchor="end" className="gt">Age 30</text>
        <path pathLength={1} d={path('messi')} className="ln m" />
        <path pathLength={1} d={path('ronaldo')} className="ln r" />
        <text x={x(mx[0]) - 110} y={y(mx[1]) - 34} textAnchor="end" className="end m">Messi {mx[1]}</text>
        <text x={x(rx[0]) - 4} y={y(rx[1]) + 120} textAnchor="end" className="end r">Ronaldo {rx[1]}</text>
      </svg>
    </div>
  )
}

export function Ages() {
  return (
    <Claim id="ages" title="After 30 he outscored Messi by 150." r={r.after30} m={m.after30} rSub="goals after turning 30" mSub="goals after turning 30" note={<>From 35: <Count to={r.after35} /> to <Count to={m.after35} />. Injury absences to August 2025: 85 matches to 196.</>}>
      <Race />
    </Claim>
  )
}
