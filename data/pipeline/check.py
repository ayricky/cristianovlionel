"""Fail loudly if a headline number on the site drifts. Run after build.py."""
import json, pathlib
s = json.load(open(pathlib.Path(__file__).resolve().parents[2] / 'src/data/site.json'))
r, m = s['ronaldo'], s['messi']
facts = [
 (r['totals']['goals'], 985), (m['totals']['goals'], 937), (r['totals']['assists'], 261), (m['totals']['assists'], 428),
 (r['totals']['apps'], 1343), (m['totals']['apps'], 1184), (r['totals']['pens'], 184), (m['totals']['pens'], 115),
 (r['totals']['leagueValidated'], 626), (m['totals']['leagueValidated'], 578),
 (r['erase']['goals']['pts'], 532), (m['erase']['goals']['pts'], 462), (r['erase']['goalsAssists']['pts'], 701), (m['erase']['goalsAssists']['pts'], 759),
 (r['trophyCount']['total'], 35), (m['trophyCount']['total'], 45), (r['trophyCount']['gone'], 19), (m['trophyCount']['gone'], 19),
 (r['clutch']['all']['winners'], 316), (m['clutch']['all']['winners'], 253), (r['clutch']['nonPen']['total'], 801), (m['clutch']['nonPen']['total'], 822),
 (r['stage']['uclQfPlus']['goals'], 42), (m['stage']['uclQfPlus']['goals'], 20), (r['byComp']['Champions League']['goals'], 140), (m['byComp']['Champions League']['goals'], 129),
 (r['intl']['goals'], 146), (m['intl']['goals'], 126), (r['after30'], 522), (m['after30'], 372), (r['after35'], 263), (m['after35'], 168),
 (r['combos']['perfect'].__len__(), 11), (m['combos']['perfect'].__len__(), 0), (r['combos']['twoHeaders'], 12), (m['combos']['twoHeaders'], 0),
 (r['map']['goals'], 234), (m['map']['goals'], 253), (r['ranks']['uefa'][3]['goals'], 44), (m['ranks']['uefa'][3]['goals'], 27),
 (r['comebacks']['wins'], 53), (m['comebacks']['wins'], 50), (r['minutes']['covered'], 90), (m['minutes']['covered'], 89),
 (r['pad']['friendly'], 22), (m['pad']['friendly'], 55), (r['pad']['blowout'], 270), (m['pad']['blowout'], 310), (r['pad']['friendlyHats'], 0), (m['pad']['friendlyHats'], 6),
 (r['pad']['bottom3'], 71), (m['pad']['bottom3'], 88), (r['pad']['bottom3Apps'], 93), (m['pad']['bottom3Apps'], 87), (r['pad']['competitive'], 124), (m['pad']['competitive'], 71),
 (r['big']['tiesDecided'], 11), (m['big']['tiesDecided'], 6), (r['big']['koHats'], 4), (m['big']['koHats'], 2), (r['big']['koLate'], 4), (m['big']['koLate'], 0),
 (r['big']['semisFinals']['goals'], 31), (m['big']['semisFinals']['goals'], 19), (r['big']['intlTop10']['goals'], 14), (m['big']['intlTop10']['goals'], 7), (r['big']['giants']['Bayern Munich']['goals'], 9), (m['big']['giants']['Bayern Munich']['goals'], 4),
 (m['gaps']['qfDrought'], 12), (r['gaps']['qfDrought'], 3), (m['gaps']['natFinalsLost'], 5), (m['gaps']['natLostGoals'], 0), (r['gaps']['natFinalsLost'], 1), (m['gaps']['wcPensMissed'], 4), (r['gaps']['wcPensMissed'], 1),
 (r['anatomy']['left'] + r['anatomy']['right'] + r['anatomy']['head'] + r['anatomy']['other'], 985),
 (m['anatomy']['left'] + m['anatomy']['right'] + m['anatomy']['head'] + m['anatomy']['other'], 937),
]
bad = [(a, b) for a, b in facts if a != b]
assert not bad, bad
for p in (r, m):
    assert len(p['goals']) == p['totals']['goals']
    assert sum(g[5] for g in p['goals']) == p['clutch']['all']['winners']
    assert sum(g[4] for g in p['goals']) == p['totals']['pens']
print('ok', len(facts), 'facts')
