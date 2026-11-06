import { fmtDate, site } from '../lib/data'

/** Every match they played against each other. */
export function Meetings() {
  return (
    <div className="scroll-x">
      <table className="tbl">
        <thead><tr><th>Date</th><th>Competition</th><th>Match</th><th>Ronaldo</th><th>Messi</th></tr></thead>
        <tbody>{site.h2h.map((x) => <tr key={x.iso}><td>{fmtDate(x.iso)}</td><td>{x.comp}</td><td>{x.team} {x.t}-{x.o} {x.opp}</td><td>{x.rg}{x.ra ? ` + ${x.ra}` : ''}</td><td>{x.mg}{x.ma ? ` + ${x.ma}` : ''}</td></tr>)}</tbody>
      </table>
    </div>
  )
}
