import { useMemo } from 'react'
import { goals, P, pct, type Who } from '../lib/data'
import { Exhibit, Versus } from './Bits'
import { TitleBars } from './Races'

const r = P('ronaldo'), m = P('messi')
const a = r.anatomy, b = m.anatomy
const per = (w: typeof r, k: string) => (w.advanced.per90[k].per90 as number).toFixed(2)
const late = (w: Who, k: number) => goals(w).filter((g) => (g[3] === 0 || g[3] === -1) && g[1] >= k).length
type Row = [string, string | number, string | number]

const GROUPS: [string, Row[]][] = [
  ['Decisive', [['Non-penalty winners', r.clutch.nonPen.winners, m.clutch.nonPen.winners], ['Late winners, minute 80+', r.clutch.all.lateWinners, m.clutch.all.lateWinners], ['Decisive goals from minute 85', late('ronaldo', 85), late('messi', 85)], ['1-0 wins, his goal alone', r.clutch.soleGoal1_0, m.clutch.soleGoal1_0], ['Wins where he scored every goal', r.clutch.allTeamGoalsInWin, m.clutch.allTeamGoalsInWin], ['Minutes of the match scored in', r.minutes.covered, m.minutes.covered], ['Extra-time goals', r.minutes.extraTime, m.minutes.extraTime], ['Draws saved from behind', r.comebacks.draws, m.comebacks.draws]]],
  ['Comebacks', [['Wins after scoring from behind', r.comebacks.wins, m.comebacks.wins], ['Points rescued from behind', r.comebacks.points, m.comebacks.points], ['Comebacks from minute 80', r.comebacks.late, m.comebacks.late], ['Comeback wins in knockouts', r.comebacks.koWins, m.comebacks.koWins], ['Comeback wins in the Champions League', r.comebacks.uclWins, m.comebacks.uclWins]]],
  ['Named opponents', Object.keys(r.big.giants).map((k) => [`v ${k}`, `${r.big.giants[k].goals} in ${r.big.giants[k].apps}`, `${m.big.giants[k].goals} in ${m.big.giants[k].apps}`] as Row)],
  ['Big nights', [...['Group', 'R16', 'QF', 'SF', 'F'].map((k) => [`Champions League: ${k}`, `${r.stage[k].goals} in ${r.stage[k].apps}`, `${m.stage[k].goals} in ${m.stage[k].apps}`] as Row), ...[1, 2, 3, 4].map((i) => [r.ranks.uefa[i].k.replace('vs Top', 'Champions League v UEFA top'), `${r.ranks.uefa[i].goals} in ${r.ranks.uefa[i].apps}`, `${m.ranks.uefa[i].goals} in ${m.ranks.uefa[i].apps}`] as Row)]],
  ['Padding', [['Goals already 3+ up', r.pad.threeUp, m.pad.threeUp], ['Goals already 2+ up', pct(r.clutch.all.padding, 985), pct(m.clutch.all.padding, 937)], ['Assists in wins by 4+', r.pad.blowoutAssists, m.pad.blowoutAssists], ['Club goals per home game', r.pad.clubHome, m.pad.clubHome], ['Club goals per away game', r.pad.clubAway, m.pad.clubAway], ['Points won per goal', r.pad.ptsPerGoal, m.pad.ptsPerGoal]]],
  ['Range', [['Stronger foot', a.right, b.left], ['Weaker foot', a.left, b.right], ['Headers', a.head, b.head], ['Matches with two headers', r.combos.twoHeaders, m.combos.twoHeaders], ['Foot and head in one match', r.combos.footHead, m.combos.footHead], ['Inside the box', a.insideBox, b.insideBox], ['Outside the box', a.outsideBox, b.outsideBox], ['Direct free kicks', a.freeKicks, b.freeKicks], ['Foot and head balance, 1.00 is even', r.evenness.toFixed(2), m.evenness.toFixed(2)], ['Penalties won', r.advanced.penWon, m.advanced.penWon], ['Hat-tricks', a.hatTricks, b.hatTricks], ['Aerial duels per 90', per(r, 'aerialDuels'), per(m, 'aerialDuels')], ['Shots per 90', per(r, 'shots'), per(m, 'shots')], ['League goals from crosses, 2014-23', r.map.cross, m.map.cross]]],
  ['Creation', [['Champions League assists, UEFA count', 42, 40], ['Champions League knockout assists', r.advanced.ucl.koAssists, m.advanced.ucl.koAssists], ['Key passes per 90', per(r, 'keyPasses'), per(m, 'keyPasses')], ['Big chances created per 90', per(r, 'bigChancesCreated'), per(m, 'bigChancesCreated')], ['Successful dribbles per 90', per(r, 'successfulDribbles'), per(m, 'successfulDribbles')], ['League goals over xG, 2014-23', '+4.6', '+33.1'], ['Free-kick conversion', `${(a.freeKicks / r.advanced.fkAttempts * 100).toFixed(1)}%`, `${(b.freeKicks / m.advanced.fkAttempts * 100).toFixed(1)}%`]]],
  ['Reach', [['Countries with a league title', 4, 3], ['Countries with a golden boot', 4, 2], ['Teams scored against', r.reach.scoredAgainst, m.reach.scoredAgainst], ['Competitions scored in', r.reach.comps, m.reach.comps], ['Goalkeepers beaten, to July 2026', r.reach.keepers, m.reach.keepers], ['Away goals', r.reach.venue.A.goals, m.reach.venue.A.goals], ['50-goal club seasons', r.reach.club50, m.reach.club50], ['30-goal calendar years', r.reach.year30, m.reach.year30], ['Minutes played', r.totals.mins, m.totals.mins], ['Top sprint speed, km/h, 2017 study', '33.6', '32.5']]],
]

export function Numbers() {
  const groups = useMemo(() => GROUPS, [])
  return (
    <Exhibit id="numbers">
      <h2 className="small">Every number</h2>
      {groups.map(([g, rows]) => (
        <div key={g} className="num-group">
          <h3>{g}</h3>
          <div className="vs-table dense">{rows.map(([k, x, y]) => <Versus key={k} label={k} r={x} m={y} />)}</div>
        </div>
      ))}
      <div className="num-group"><h3>Title seasons, with and without his goals</h3><div className="split"><TitleBars who="ronaldo" /><TitleBars who="messi" /></div></div>
    </Exhibit>
  )
}
