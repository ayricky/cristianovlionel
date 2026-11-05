import { P } from '../lib/data'
import { Claim } from './Claim'

const r = P('ronaldo'), m = P('messi')
const ROUND: Record<string, string> = { F: 'final', SF: 'semi', QF: 'quarter', R16: 'last 16' }
const NAME: Record<string, string> = { 'Atletico Madrid': 'Atlético', 'Paris Saint-Germain': 'PSG', 'Manchester United': 'Man United' }
const Ties = ({ list }: { list: { opp: string; year: string; round: string }[] }) => <ul className="tie-list">{list.map((t) => <li key={t.opp + t.year}><b>{NAME[t.opp] ?? t.opp}</b><span>{t.year}, {ROUND[t.round]}</span></li>)}</ul>

export function Biggest() {
  const b = r.big, c = m.big
  const u = r.ranks.uefa, v = m.ranks.uefa
  return (
    <>
      <Claim id="nights" title="44 goals against Europe's ten best clubs. Messi has 27." r={u[3].goals} m={v[3].goals} rSub={`in ${u[3].apps} Champions League games`} mSub={`in ${v[3].apps} Champions League games`} dots note={`Against the top five it is ${u[2].goals} to ${v[2].goals}.`} />
      <Claim title="From the quarter-finals on, he scored twice as many." r={r.stage.uclQfPlus.goals} m={m.stage.uclQfPlus.goals} rSub={`in ${r.stage.uclQfPlus.apps} games`} mSub={`in ${m.stage.uclQfPlus.apps} games`} dots note={`25 to 12 in quarter-finals. 13 to 6 in semi-finals.`} clip="everyUcl" />
      <Claim title="His goals alone decided eleven Champions League knockout ties." r={b.tiesDecided} m={c.tiesDecided} rSub={`of ${b.tiesWon} won`} mSub={`of ${c.tiesWon} won`} note="Remove his goals from each one and his team goes out.">
        <div className="split rise"><Ties list={b.ties} /><Ties list={c.ties} /></div>
      </Claim>
      <Claim title="Four knockout hat-tricks. Messi has two." r={b.koHats} m={c.koHats} dots note={`Go-ahead or equalising goals from minute 80 in those knockouts: ${b.koLate} to ${c.koLate}.`} />
      <Claim title="Semi-finals and finals: 31 goals to 19." r={b.semisFinals.goals} m={c.semisFinals.goals} rSub={`in ${b.semisFinals.apps} games`} mSub={`in ${c.semisFinals.apps} games`} dots note="Champions League, World Cup, Euros, Copa América, Nations League and Club World Cup." />
      <Claim title="Bayern Munich, eight games each: nine goals to four." r={b.giants['Bayern Munich'].goals} m={c.giants['Bayern Munich'].goals} rSub="in 8 games" mSub="in 8 games" dots note={`Juventus: ${b.giants.Juventus.goals} in ${b.giants.Juventus.apps} to ${c.giants.Juventus.goals} in ${c.giants.Juventus.apps}.`} />
    </>
  )
}
