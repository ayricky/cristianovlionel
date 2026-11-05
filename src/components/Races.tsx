import { fmtSeason, leagues, shortTeam, type Who } from '../lib/data'
import { useInView } from './Bits'

const short = (c: string) => c.replace(" Supporters' Shield", ' Shield').replace(' Pro League', '').replace('Premier League', 'Prem')
const nm = (t: string) => shortTeam[t] ?? t
export function TitleBars({ who }: { who: Who }) {
  const list = leagues(who)
  const [ref, on] = useInView<HTMLOListElement>()
  return (
    <ol ref={ref} className={`titles ${on ? 'in' : ''}`}>
      {list.map((l, i) => (
        <li key={l.comp + l.season} className={l.kept ? 'kept' : ''} style={{ '--d': `${i * 45}ms` } as React.CSSProperties}>
          <span className="t-name"><b>{fmtSeason(l.season)}</b> {short(l.comp)}</span>
          <span className="t-bar"><i className="whole" style={{ width: `${l.pts}%` }} /><i className="left" style={{ width: `${l.pts2}%` }} /></span>
          <span className="t-out">{l.pts}<em>to</em>{l.pts2}</span>
          <span className="t-new">{l.kept ? 'Kept' : `${nm(l.champion2)} win`}</span>
        </li>
      ))}
    </ol>
  )
}
