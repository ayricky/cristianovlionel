import { P } from '../lib/data'
import { Claim } from './Claim'

const r = P('ronaldo').gaps, m = P('messi').gaps
const psg = m.clubs['Paris Saint-Germain']
const FALLS = [['Rome, 2018', 'Led 4-1. Lost 0-3, out on away goals.'], ['Anfield, 2019', 'Led 3-0. Lost 0-4.'], ['Lisbon, 2020', 'Lost 2-8 to Bayern.']]

export function Gaps() {
  return (
    <div id="gaps">
      <Claim bad title="Twelve Champions League quarter-final games in a row without a goal." r={r.qfDrought} m={m.qfDrought} rSub="his longest run" mSub="2013 to 2019" dots note={`Quarter-final goals: ${r.qfGoals} to ${m.qfGoals}.`} />
      <Claim bad title="Since 2015: three Champions Leagues to none." r={3} m={0} note="Messi did not score in any of these three.">
        <ul className="falls rise">{FALLS.map(([a, b]) => <li key={a}><b>{a}</b><span>{b}</span></li>)}</ul>
      </Claim>
      <Claim bad title="Five finals lost for Argentina. Not one goal." r={r.natFinalsLost} m={m.natFinalsLost} rSub="final lost for Portugal" mSub="finals lost for Argentina" note="He quit the national team after the 2016 final, then came back." />
      <Claim bad title="New league in his thirties: 21 goals to 6." r={21} m={6} rSub="Juventus, age 33" mSub="PSG, age 34" dots note={`${psg[0]} goals in ${psg[1]} games for PSG, out in the last 16 twice.`} />
      <Claim bad title="Most missed penalties in World Cup history." r={r.wcPensMissed} m={m.wcPensMissed} note={`Career conversion: ${r.penPct}% to ${m.penPct}%. He also missed in the shootouts of the 2016 Copa final and the 2024 Copa quarter-final.`} />
      <Claim bad title="A Champions League winner at one club. Ronaldo did it at two." r={2} m={1} note="League golden boots in Europe's big leagues: England, Spain and Italy for Ronaldo. Spain alone for Messi." />
    </div>
  )
}
