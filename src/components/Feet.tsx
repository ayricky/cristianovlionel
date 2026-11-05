import { fmtDate, P, pct } from '../lib/data'
import { Claim } from './Claim'

const r = P('ronaldo'), m = P('messi')
const a = r.anatomy, b = m.anatomy
export function Feet() {
  return (
    <>
      <Claim id="feet" title="Left foot, right foot and head, all in one match. Eleven times." r={r.combos.perfect.length} m={m.combos.perfect.length} dots note={`Most recently at 41, against ${r.combos.perfect[10].opp}. Also Bayern Munich in ${fmtDate(r.combos.perfect[6].iso).slice(-4)}.`} clip="hat985" />
      <Claim title="Five times as many headers." r={a.head} m={b.head} rSub={`${pct(a.head, a.goals)} of his goals`} mSub={`${pct(b.head, b.goals)} of his goals`} dots note="He met one at 2.56m against Sampdoria, 12cm above the crossbar." clip="sampdoria2019" />
      <Claim title="His weaker foot outscored Messi's." r={a.left} m={b.right} rSub="left foot" mSub="right foot" dots clip="leftFoot" />
    </>
  )
}
