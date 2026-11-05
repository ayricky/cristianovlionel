import { useRef } from 'react'
import { P } from '../lib/data'
import { Count, useRise } from './Bits'

const r = P('ronaldo'), m = P('messi')
const per = (a: number, b: number) => Math.round((a / b) * 100)
const LINES: [string, number, number, string?][] = [
  ['Trophies that needed his goals', per(r.trophyCount.gone, r.trophyCount.total), per(m.trophyCount.gone, m.trophyCount.total), '%'],
  ['Champions League goals v the top 10 clubs', r.ranks.uefa[3].goals, m.ranks.uefa[3].goals],
  ['Champions League goals from the quarter-finals on', r.stage.uclQfPlus.goals, m.stage.uclQfPlus.goals],
  ['Champions League ties decided by his goals', r.big.tiesDecided, m.big.tiesDecided],
  ['Match-winning goals', r.clutch.all.winners, m.clutch.all.winners],
  ['Perfect hat-tricks', r.combos.perfect.length, 0],
  ['Competitive international goals', r.pad.competitive, m.pad.competitive],
]

/** The whole argument on one screen, for anyone who stops here. */
export function Case() {
  const box = useRef<HTMLElement>(null)
  useRise(box)
  return (
    <section id="case" className="case" ref={box}>
      <h2 className="say rise">The case in one screen</h2>
      <ol>
        {LINES.map(([k, a, b, s]) => (
          <li key={k} className="rise">
            <b className="r"><Count to={a} suffix={s ?? ''} /></b>
            <span>{k}</span>
            <b className="m dim"><Count to={b} suffix={s ?? ''} /></b>
          </li>
        ))}
      </ol>
    </section>
  )
}
