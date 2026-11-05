import { P } from '../lib/data'
import { Claim } from './Claim'

const r = P('ronaldo'), m = P('messi')
export function Country() {
  return (
    <>
      <Claim id="country" title="146 for his country. The men's record." r={r.intl.goals} m={m.intl.goals} note="Final as of 5 November 2026. Portugal had never won a major trophy before him." clip="spain2025">
        <div className="split duo rise"><img src="/img/r-euro.jpg" alt="Ronaldo at Euro 2016" loading="lazy" /><img src="/img/m-2022.jpg" alt="Messi at the 2022 World Cup" loading="lazy" /></div>
      </Claim>
      <Claim title="When it counted, he doubled Messi against the top ten nations." r={r.big.intlTop10.goals} m={m.big.intlTop10.goals} rSub={`in ${r.big.intlTop10.apps} competitive games`} mSub={`in ${m.big.intlTop10.apps} competitive games`} dots note={`All competitive international goals: ${r.pad.competitive} to ${m.pad.competitive}.`} clip="spain2018" />
    </>
  )
}
