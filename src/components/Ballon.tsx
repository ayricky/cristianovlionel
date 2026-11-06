import { Fragment, useState } from 'react'
import { img } from '../lib/variant'
import { P } from '../lib/data'

const r = P('ronaldo').ballon, m = P('messi').ballon
type Call = 'Ronaldo won' | 'Should be Ronaldo' | 'Close' | 'Messi'
interface Year { y: number; vote: string; call: Call; why: string; pic?: [string, string] }
const YEARS: Year[] = [
  { y: 2009, vote: 'Messi 473, Ronaldo 233', call: 'Messi', why: "Barcelona's treble." },
  { y: 2010, vote: 'Messi 22.65%, Ronaldo 6th', call: 'Messi', why: 'Messi outscored him 56 to 41. Iniesta and Sneijder were the real debate.' },
  { y: 2011, vote: 'Messi 47.88%, Ronaldo 21.60%', call: 'Close', why: 'Ronaldo scored faster, but Messi won the Champions League.' },
  { y: 2012, vote: 'Messi 41.60%, Ronaldo 23.68%', call: 'Should be Ronaldo', why: 'La Liga with 100 points, the Supercopa, and a goal in all six Clásicos (7 to 4). Messi won the Copa del Rey. His famous 91 stood at 82 when the finalists were named on 29 November, still far ahead of Ronaldo on raw goals.', pic: ['y-2012.jpg', 'Ronaldo calming the Camp Nou after his winner, April 2012'] },
  { y: 2013, vote: 'Ronaldo 27.99%, Messi 24.72%', call: 'Ronaldo won', why: 'Agreed.' },
  { y: 2014, vote: 'Ronaldo 37.66%, Messi 15.76%', call: 'Ronaldo won', why: 'Agreed.' },
  { y: 2015, vote: 'Messi 41.33%, Ronaldo 27.76%', call: 'Messi', why: 'Another treble, and Ronaldo won nothing.' },
  { y: 2016, vote: 'Ronaldo 745, Messi 316', call: 'Ronaldo won', why: 'Agreed.' },
  { y: 2017, vote: 'Ronaldo 946, Messi 670', call: 'Ronaldo won', why: 'Agreed.' },
  { y: 2018, vote: 'Modrić 753, Ronaldo 476, Messi 280', call: 'Should be Ronaldo', why: 'Champions League winner and its top scorer with 15, one of them the bicycle kick, plus 4 World Cup goals. Modrić won the same Champions League and reached the World Cup final.', pic: ['y-2018.jpg', "Ronaldo's bicycle kick against Juventus, April 2018"] },
  { y: 2019, vote: 'Messi 686, van Dijk 679, Ronaldo 476', call: 'Should be Ronaldo', why: 'Three trophies to one: Serie A, the Nations League and the Supercoppa against La Liga. Hat-tricks v Atlético and Switzerland. Barcelona lost 4-0 at Anfield from 3-0 up. Messi scored more, 38 to 29.', pic: ['y-2019.jpg', 'Ronaldo lifting the Nations League trophy in Porto, June 2019'] },
  { y: 2021, vote: 'Messi 613, Ronaldo 178 (6th)', call: 'Close', why: 'Two trophies each and the Euro Golden Boot. Messi had the Copa América.' },
  { y: 2023, vote: 'Messi 462, Haaland 357', call: 'Messi', why: 'The World Cup.' },
]
const TALLY: [string, string, string][] = [['Official', '5', '8'], ['Our recount', '8', '6']]

export function Ballon() {
  const [open, setOpen] = useState<number | null>(2012)
  return (
    <div className="ballon">
      <div className="tally-mini">
        {TALLY.map(([k, a, b]) => <p key={k}><span>{k}</span> Ronaldo <b>{a}</b>, Messi <b>{b}</b></p>)}
        <p className="card-note">The recount is our argument: 2012, 2018 and 2019 change hands. Goals are inside each award's voting window.</p>
      </div>
      <div className="scroll-x">
        <table className="tbl">
          <thead><tr><th>Year</th><th>Vote</th><th>Goals, R v M</th><th>Goals per 90</th><th>Match winners</th><th>Level or behind</th><th>Our call</th></tr></thead>
          <tbody>
            {YEARS.map((x) => {
              const a = r[x.y], b = m[x.y], on = open === x.y
              return (
                <Fragment key={x.y}>
                  <tr className={`pick ${x.call === 'Should be Ronaldo' ? 'hot' : ''}`} onClick={() => setOpen(on ? null : x.y)}>
                    <td><button aria-expanded={on}>{x.y}</button></td><td>{x.vote}</td><td>{a.goals} v {b.goals}</td><td>{a.per90} v {b.per90}</td><td>{a.winners} v {b.winners}</td><td>{a.levelOrBehind}% v {b.levelOrBehind}%</td><td><span className={`call ${x.call === 'Should be Ronaldo' ? 'on' : ''}`}>{x.call}</span></td>
                  </tr>
                  {on && <tr className="why"><td colSpan={7}><div>{x.pic && <img src={img(x.pic[0])} alt={x.pic[1]} />}<p>{x.why}</p></div></td></tr>}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
