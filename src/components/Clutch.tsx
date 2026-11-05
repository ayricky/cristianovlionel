import { COUNT, tanks } from '../lib/shapes'
import { P, pct } from '../lib/data'
import { Story, type Step } from './Story'

const r = P('ronaldo'), m = P('messi')
const lab = (a: string, ca: string, b: string, cb: string) => <div className="tank-l good"><div><b className="r">{a}</b><span>{ca}</span></div><div><b className="m">{b}</b><span>{cb}</span></div></div>
const w = (x: typeof r) => x.clutch.all.winners
const lb = (x: typeof r) => x.state3.behind + x.state3.level
const steps: Step[] = [
  { head: <h2>One goal in three <em>won the match</em></h2>, shape: (p, s) => tanks(p, s, 32, 0, false), labels: lab(pct(w(r), COUNT.ronaldo), `${w(r)} winners`, pct(w(m), COUNT.messi), `${w(m)} winners`) },
  { head: <h2>Half came with <em>nothing won yet</em></h2>, body: <p>Scored with his team level or behind.</p>, shape: (p, s) => tanks(p, s, 64, 0, false), labels: lab(pct(lb(r), COUNT.ronaldo), `${lb(r)} goals`, pct(lb(m), COUNT.messi), `${lb(m)} goals`) },
]
export function Clutch() { return <Story id="clutch" steps={steps} /> }
