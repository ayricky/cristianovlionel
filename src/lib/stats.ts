import type { Stat } from '../components/Bits'
import { comps, eraseOf, goals, matches, P, pct, site, type Who } from './data'

const r = P('ronaldo'), m = P('messi')
const a = r.anatomy, b = m.anatomy
const R = 985, M = 937
const per = (w: typeof r, k: string) => (w.advanced.per90[k].per90 as number).toFixed(2)
const late = (w: Who, k: number) => goals(w).filter((g) => (g[3] === 0 || g[3] === -1) && g[1] >= k).length
const inn = (x: { goals: number; apps: number }) => `${x.goals} in ${x.apps}`
const wcKo = (w: Who) => {
  const rows = matches(w).filter((x) => comps(w)[x[1]] === 'World Cup' && ['R32', 'R16', 'QF', 'SF', 'F'].includes(x[10]))
  return `${rows.reduce((s, x) => s + x[7], 0)} in ${rows.length}`
}
const hW = site.h2h.filter((x) => x.t > x.o).length, hL = site.h2h.filter((x) => x.t < x.o).length
const u = r.ranks.uefa, v = m.ranks.uefa
const s = (k: string, x: string | number, y: string | number, more: Partial<Stat> = {}): Stat => ({ k, r: x, m: y, ...more })

export interface Section { id: string; title: string; line: string; rows: Stat[] }
export const SECTIONS: Section[] = [
  { id: 'impact', title: 'What his goals decided', line: 'Remove each player\'s goals and replay every result.', rows: [
    s('Results changed', eraseOf(matches('ronaldo')).flips, eraseOf(matches('messi')).flips),
    s('Trophies that needed his goals', `${r.trophyCount.gone} of ${r.trophyCount.total}`, `${m.trophyCount.gone} of ${m.trophyCount.total}`),
    s('Match-winning goals', r.clutch.all.winners, m.clutch.all.winners),
    s('Share of goals that won the match', pct(r.clutch.all.winners, R), pct(m.clutch.all.winners, M)),
    s('Share scored level or behind', pct(r.state3.behind + r.state3.level, R), pct(m.state3.behind + m.state3.level, M)),
    s('Competitive international goals', r.pad.competitive, m.pad.competitive),
  ] },
  { id: 'big', title: 'Big games', line: 'The further the competition goes, the wider the gap.', rows: [
    s("Champions League v Europe's top 10 clubs", inn({ goals: u[3].goals, apps: u[3].apps }), inn({ goals: v[3].goals, apps: v[3].apps })),
    s("Champions League v Europe's top 5 clubs", u[2].goals, v[2].goals),
    s('Champions League, quarter-finals on', inn(r.stage.uclQfPlus), inn(m.stage.uclQfPlus)),
    s('Champions League ties decided by his goals', `${r.big.tiesDecided} of ${r.big.tiesWon}`, `${m.big.tiesDecided} of ${m.big.tiesWon}`, { note: 'Tie won, and lost without his goals.' }),
    s('Knockout hat-tricks', r.big.koHats, m.big.koHats),
    s('Go-ahead or level goals from minute 80, knockouts', r.big.koLate, m.big.koLate),
    s('Semi-finals and finals, all competitions', inn(r.big.semisFinals), inn(m.big.semisFinals)),
    s('Competitive games v top 10 nations', inn(r.big.intlTop10), inn(m.big.intlTop10)),
    ...['Group', 'R16', 'QF', 'SF', 'F'].map((k) => s(`Champions League: ${k}`, inn(r.stage[k]), inn(m.stage[k]))),
    ...[1, 2, 3, 4].map((i) => s(r.ranks.uefa[i].k.replace('vs Top', 'Champions League v UEFA top'), inn(r.ranks.uefa[i]), inn(m.ranks.uefa[i]))),
  ] },
  { id: 'clutch', title: 'Clutch and comebacks', line: 'Goals when the match was still in the balance.', rows: [
    s('Non-penalty winners', r.clutch.nonPen.winners, m.clutch.nonPen.winners),
    s('Late winners, minute 80+', r.clutch.all.lateWinners, m.clutch.all.lateWinners),
    s('Decisive goals from minute 85', late('ronaldo', 85), late('messi', 85)),
    s('Wins after scoring from behind', r.comebacks.wins, m.comebacks.wins),
    s('Points rescued from behind', r.comebacks.points, m.comebacks.points),
    s('Comeback wins in knockouts', r.comebacks.koWins, m.comebacks.koWins),
    s('Comeback wins in the Champions League', r.comebacks.uclWins, m.comebacks.uclWins),
    s('Comebacks from minute 80', r.comebacks.late, m.comebacks.late),
    s('Draws saved from behind', r.comebacks.draws, m.comebacks.draws),
    s('1-0 wins, his goal alone', r.clutch.soleGoal1_0, m.clutch.soleGoal1_0),
    s('Wins where he scored every goal', r.clutch.allTeamGoalsInWin, m.clutch.allTeamGoalsInWin),
    s('Minutes of the match scored in', r.minutes.covered, m.minutes.covered),
    s('Extra-time goals', r.minutes.extraTime, m.minutes.extraTime),
  ] },
  { id: 'padding', title: 'Stat padding', line: 'How many goals came when they changed nothing.', rows: [
    s('Goals in wins by four or more', pct(r.pad.blowout, R), pct(m.pad.blowout, M), { low: true, note: `${r.pad.blowout} and ${m.pad.blowout} goals.` }),
    s('Goals per game v the bottom three', (r.pad.bottom3 / r.pad.bottom3Apps).toFixed(2), (m.pad.bottom3 / m.pad.bottom3Apps).toFixed(2), { low: true, note: `${r.pad.bottom3} in ${r.pad.bottom3Apps} and ${m.pad.bottom3} in ${m.pad.bottom3Apps}.` }),
    s('International goals in friendlies', pct(r.pad.friendly, r.pad.intl), pct(m.pad.friendly, m.pad.intl), { low: true, note: "Six of Messi's 11 international hat-tricks were friendlies. Ronaldo: none of 10." }),
    s('Goals v his ten favourite opponents', pct(r.pad.top10, R), pct(m.pad.top10, M), { low: true }),
    s('Goals already 3+ up', r.pad.threeUp, m.pad.threeUp, { low: true }),
    s('Goals already 2+ up', pct(r.clutch.all.padding, R), pct(m.clutch.all.padding, M), { low: true }),
    s('Assists in wins by 4+', r.pad.blowoutAssists, m.pad.blowoutAssists, { low: true }),
    s('Points won per goal', r.pad.ptsPerGoal, m.pad.ptsPerGoal),
    s('Club goals per home game', r.pad.clubHome, m.pad.clubHome, { plain: true }),
    s('Club goals per away game', r.pad.clubAway, m.pad.clubAway),
  ] },
  { id: 'gaps', title: 'The gaps in Messi\'s record', line: 'Where the record thins out.', rows: [
    s('Longest quarter-final run without a goal', r.gaps.qfDrought, m.gaps.qfDrought, { low: true, note: 'Champions League games. Messi: 2013 to 2019.' }),
    s('Quarter-final goals', r.gaps.qfGoals, m.gaps.qfGoals),
    s('Champions Leagues since 2015', 3, 0, { note: 'Out at Rome 2018, Anfield 2019 and Lisbon 2020 without scoring.' }),
    s('Finals lost for his country', r.gaps.natFinalsLost, m.gaps.natFinalsLost, { low: true, note: 'Messi: five finals, not one goal.' }),
    s('First season in a new league, in his thirties', 21, 6, { note: 'Juventus at 33, PSG at 34.' }),
    s('World Cup penalties missed', r.gaps.wcPensMissed, m.gaps.wcPensMissed, { low: true }),
    s('Career penalty conversion', `${r.gaps.penPct}%`, `${m.gaps.penPct}%`),
    s('Clubs he won the Champions League with', 2, 1),
    s('Countries with a golden boot', 4, 2),
  ] },
  { id: 'range', title: 'Complete forward', line: 'Every way of scoring, side by side.', rows: [
    s('Perfect hat-tricks', r.combos.perfect.length, m.combos.perfect.length, { note: 'Left foot, right foot and head in one match.' }),
    s('Headers', a.head, b.head),
    s('Weaker foot', a.left, b.right),
    s('Stronger foot', a.right, b.left),
    s('Inside the box', a.insideBox, b.insideBox),
    s('Outside the box', a.outsideBox, b.outsideBox),
    s('Direct free kicks', a.freeKicks, b.freeKicks),
    s('Free-kick conversion', `${((a.freeKicks / r.advanced.fkAttempts) * 100).toFixed(1)}%`, `${((b.freeKicks / m.advanced.fkAttempts) * 100).toFixed(1)}%`),
    s('Hat-tricks', a.hatTricks, b.hatTricks),
    s('Matches with two headers', r.combos.twoHeaders, m.combos.twoHeaders),
    s('Foot and head in one match', r.combos.footHead, m.combos.footHead),
    s('Foot and head balance, 1.00 is even', r.evenness.toFixed(2), m.evenness.toFixed(2)),
    s('Penalties won', r.advanced.penWon, m.advanced.penWon),
    s('Aerial duels per 90', per(r, 'aerialDuels'), per(m, 'aerialDuels'), { plain: true }),
    s('Shots per 90', per(r, 'shots'), per(m, 'shots')),
    s('League goals from crosses, 2014-23', r.map.cross, m.map.cross),
    s('Top sprint speed, km/h, 2017 study', '33.6', '32.5'),
  ] },
  { id: 'reach', title: 'Longevity and reach', line: 'How long, and in how many places.', rows: [
    s('Goals after turning 30', r.after30, m.after30),
    s('Goals from age 35', r.after35, m.after35),
    s('Injury absences to August 2025', 85, 196, { low: true, note: 'Matches missed.' }),
    s('Goals for his country', r.intl.goals, m.intl.goals),
    s('Countries with a league title', 4, 3),
    s('Teams scored against', r.reach.scoredAgainst, m.reach.scoredAgainst),
    s('Competitions scored in', r.reach.comps, m.reach.comps),
    s('Goalkeepers beaten, to July 2026', r.reach.keepers, m.reach.keepers),
    s('Away goals', r.reach.venue.A.goals, m.reach.venue.A.goals),
    s('50-goal club seasons', r.reach.club50, m.reach.club50),
    s('30-goal calendar years', r.reach.year30, m.reach.year30),
    s('Minutes played', r.totals.mins, m.totals.mins, { plain: true }),
  ] },
  { id: 'clubs', title: 'Named opponents', line: 'Every club we checked, including those where Messi leads.', rows:
    Object.keys(r.big.giants).map((k) => s(`v ${k}`, inn(r.big.giants[k]), inn(m.big.giants[k]))) },
  { id: 'messi', title: 'The case for Messi', line: 'The other side of the argument.', rows: [
    s('Assists', r.totals.assists, m.totals.assists),
    s('Non-penalty goals', 801, 822),
    s('Goals per game', (R / r.totals.apps).toFixed(2), (M / m.totals.apps).toFixed(2)),
    s('Points gone, goals and assists', r.erase.goalsAssists.pts, m.erase.goalsAssists.pts),
    s("Ballons d'Or", 5, 8),
    s('World Cups', 0, 1),
    s('World Cup knockout goals', wcKo('ronaldo'), wcKo('messi')),
    s('League goals v top-3 sides', inn(r.vsTop), inn(m.vsTop)),
    s('Wins in their 36 meetings', hW, hL),
    s('Key passes per 90', per(r, 'keyPasses'), per(m, 'keyPasses')),
    s('Big chances created per 90', per(r, 'bigChancesCreated'), per(m, 'bigChancesCreated')),
    s('Successful dribbles per 90', per(r, 'successfulDribbles'), per(m, 'successfulDribbles')),
    s('League goals over xG, 2014-23', '+4.6', '+33.1'),
    s('Champions League assists, UEFA count', 42, 40),
    s('Champions League knockout assists', r.advanced.ucl.koAssists, m.advanced.ucl.koAssists),
  ] },
  { id: 'test', title: 'The padding test, turned on Ronaldo', line: 'The same questions, asked of him.', rows: [
    s('Penalties scored', r.totals.pens, m.totals.pens, { low: true }),
    s("Goals v nations outside FIFA's top 100", 34, 14, { low: true }),
    s('Goals in Saudi Arabia v the USA', r.burden['Al Nassr'].goals, m.burden['Inter Miami'].goals, { low: true }),
  ] },
]
export const MODELS = `Whole-player models put Messi first. Hvattum's plus-minus study rates him 1st of 10,369 players and Ronaldo 26th, measured to 2017 with an age adjustment that lowers Ronaldo. VAEP calls Messi "clearly in a class of his own". Liverpool's former research director Ian Graham: "Messi does two jobs brilliantly. Ronaldo does one job brilliantly." This site measures that one job.`
