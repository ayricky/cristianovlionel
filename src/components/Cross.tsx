import { comps, matches, P, site } from '../lib/data'
import { Count, Exhibit, Versus } from './Bits'
import { Video } from './Video'

const r = P('ronaldo'), m = P('messi')
const wcKo = (w: 'ronaldo' | 'messi') => {
  const rows = matches(w).filter((x) => comps(w)[x[1]] === 'World Cup' && ['R32', 'R16', 'QF', 'SF', 'F'].includes(x[10]))
  return `${rows.reduce((s, x) => s + x[7], 0)} in ${rows.length}`
}
export function Cross() {
  const h = site.h2h
  const hW = h.filter((x) => x.t > x.o).length, hL = h.filter((x) => x.t < x.o).length
  return (
    <Exhibit id="cross">
      <h2 className="slam">Cross-<br /><em>examination.</em></h2>
      <p className="lede rise">The other bench gets its say.</p>
      <div className="vs-table">
        <Versus big label="Points gone, goals and assists" r={<Count to={r.erase.goalsAssists.pts} />} m={<Count to={m.erase.goalsAssists.pts} />} />
        <Versus label="Non-penalty goals" r={801} m={822} />
        <Versus label="Assists" r={r.totals.assists} m={m.totals.assists} />
        <Versus label="Goals per game" r={(985 / r.totals.apps).toFixed(2)} m={(937 / m.totals.apps).toFixed(2)} />
        <Versus label="Ballons d'Or" r="5" m="8" />
        <Versus label="World Cups" r="0" m="1" />
        <Versus label="World Cup knockout goals" r={wcKo('ronaldo')} m={wcKo('messi')} />
        <Versus label="League goals v top-3 sides" r={`${r.vsTop.goals} in ${r.vsTop.apps}`} m={`${m.vsTop.goals} in ${m.vsTop.apps}`} />
        <Versus label="Wins in their 36 meetings" r={hW} m={hL} />
      </div>
      <h3 className="sub rise">The padding test, turned on Ronaldo</h3>
      <div className="vs-table">
        <Versus label="Penalties scored" r={r.totals.pens} m={m.totals.pens} />
        <Versus label="Goals v nations outside FIFA's top 100" r="34" m="14" />
        <Versus label="Goals in Saudi Arabia v the USA" r={r.burden['Al Nassr'].goals} m={m.burden['Inter Miami'].goals} />
      </div>
      <div className="models rise">
        <div>
          <h3>The models</h3>
          <p>Whole-player models put Messi first. Hvattum's plus-minus study rates him 1st of 10,369 players and Ronaldo 26th, measured to 2017 with an age adjustment that lowers Ronaldo. VAEP calls Messi "clearly in a class of his own". Liverpool's former research director Ian Graham: "Messi does two jobs brilliantly. Ronaldo does one job brilliantly."</p>
          <p>This site measures that one job.</p>
        </div>
        <Video clip="messi2022" />
      </div>
    </Exhibit>
  )
}
