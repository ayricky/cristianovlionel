import { tanks } from '../lib/shapes'
import { P, pct } from '../lib/data'
import { Story, type Step } from './Story'

const r = P('ronaldo').pad, m = P('messi').pad
const R = 985, M = 937
const lab = (a: string, ca: string, b: string, cb: string) => <div className="tank-l"><div><b>{a}</b><span>{ca}</span></div><div><b>{b}</b><span>{cb}</span></div></div>

const steps: Step[] = [
  { head: <h2>The game was <em>already over</em></h2>, body: <p>Goals in wins by four or more.</p>, shape: (p, s) => tanks(p, s, 1), labels: lab(pct(r.blowout, R), `${r.blowout} goals`, pct(m.blowout, M), `${m.blowout} goals`) },
  { head: <h2>A goal a game <em>v the bottom three</em></h2>, body: <p>{m.bottom3} in {m.bottom3Apps} for Messi. {r.bottom3} in {r.bottom3Apps} for Ronaldo.</p>, shape: (p, s) => tanks(p, s, 2), labels: lab((r.bottom3 / r.bottom3Apps).toFixed(2), 'per game', (m.bottom3 / m.bottom3Apps).toFixed(2), 'per game') },
  { head: <h2>Scored in <em>friendlies</em></h2>, body: <p>Share of international goals. Six of Messi's 11 international hat-tricks were friendlies. Ronaldo: none of 10.</p>, shape: (p, s) => tanks(p, s, 4, 8), labels: lab(pct(r.friendly, r.intl), `${r.friendly} of ${r.intl}`, pct(m.friendly, m.intl), `${m.friendly} of ${m.intl}`) },
  { head: <h2>The same <em>ten teams</em></h2>, body: <p>Goals against his ten favourite opponents.</p>, shape: (p, s) => tanks(p, s, 16), labels: lab(pct(r.top10, R), `${r.top10} goals`, pct(m.top10, M), `${m.top10} goals`) },
]

export function Padding() {
  return <Story id="padding" steps={steps} />
}
