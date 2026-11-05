"""Second-pass stats: shot map, comebacks, combinations, opposition strength, range. Used by build.py."""
import collections, csv, datetime as dt, json, math, pathlib
from load import RAW

ROOT = pathlib.Path(__file__).resolve().parents[1]
PLAYER = {'ronaldo': 'Cristiano Ronaldo', 'messi': 'Lionel Messi'}
TYPE = {'RightFoot': 0, 'LeftFoot': 1, 'Head': 2, 'OtherBodyPart': 3}
SIT = {'OpenPlay': 0, 'FromCorner': 1, 'SetPiece': 2, 'DirectFreekick': 3, 'Penalty': 4}
pts = lambda a, b: 3 if a > b else 1 if a == b else 0
num = lambda v: float(v) if v not in (None, '', '-') else 0.0
_shots = None

def zone(s):
    if s['situation'] == 'Penalty':
        return 'pen'
    x, y = (1 - s['X']) * 105, abs(s['Y'] - .5) * 68
    if x <= 5.5 and y <= 9.16:
        return 'six'
    if x <= 16.5 and y <= 20.16:
        return 'central' if y <= 9.16 else 'wide'
    return 'outside'

def shots(p, ms, gs):
    """Attach every Understat goal to its row in the goal list by date and minute."""
    global _shots
    if _shots is None:
        _shots = json.load(open(ROOT / 'raw' / 'understat' / 'shots.json'))
    mine = [s for s in _shots if s['player'] == PLAYER[p]]
    by_date = collections.defaultdict(list)
    for k, g in enumerate(gs):
        by_date[ms[g['i']]['iso']].append((k, g))
    used, rows, matched = set(), [], 0
    for s in sorted(mine, key=lambda s: s['date']):
        goal = s['result'] == 'Goal'
        idx = -1
        if goal:
            d = dt.date.fromisoformat(s['date'][:10])
            cands = []
            for off in (0, -1, 1):
                for k, g in by_date.get((d + dt.timedelta(days=off)).isoformat(), []):
                    if k not in used:
                        cands.append((abs(g['min'] + g['add'] * 0 - s['minute']), k))
            cands.sort()
            if cands and cands[0][0] <= 4:
                idx = cands[0][1]; used.add(idx); matched += 1
        # metres from the goal line, and across the pitch with + towards the attacker's left
        rows.append([round((1 - s['X']) * 105, 1), round((s['Y'] - 0.5) * 68, 1), round(s['xG'], 3), int(goal), TYPE[s['shotType']], SIT[s['situation']], idx])
    g = [s for s in mine if s['result'] == 'Goal']
    np_shots = [s for s in mine if s['situation'] != 'Penalty']
    dist = lambda s: math.hypot((1 - s['X']) * 105, (s['Y'] - .5) * 68)
    head = [s for s in mine if s['shotType'] == 'Head']
    summary = dict(
        shots=len(mine), goals=len(g), matched=matched, xg=round(sum(s['xG'] for s in mine), 1), avgGoalDist=round(sum(map(dist, g)) / len(g), 1), longest=round(max(map(dist, g)), 1),
        zones=dict(collections.Counter(zone(s) for s in g)), shotZones=dict(collections.Counter(zone(s) for s in mine)),
        cross=sum(s['lastAction'] == 'Cross' for s in g), corner=sum(s['situation'] == 'FromCorner' for s in g), takeOn=sum(s['lastAction'] == 'TakeOn' for s in g), rebound=sum(s['lastAction'] == 'Rebound' for s in g), through=sum(s['lastAction'] == 'Throughball' for s in g),
        fk=sum(s['situation'] == 'DirectFreekick' for s in g), head=sum(s['shotType'] == 'Head' for s in g), headShots=len(head), headXg=round(sum(s['xG'] for s in head), 1),
        npGoals=sum(s['situation'] != 'Penalty' for s in g), npXg=round(sum(s['xG'] for s in np_shots), 1),
        leftSide=sum(s['Y'] > .64 for s in g), rightSide=sum(s['Y'] < .36 for s in g),
    )
    return rows, summary

CURATED = {
 'ronaldo': [('2019-03-12', 'atleti2019'), ('2016-04-12', 'wolfsburg2016'), ('2021-09-01', None), ('2009-04-25', 'tottenham2009'), ('2016-12-18', 'kashima2016'), ('2018-06-15', 'freekick2018'), ('2023-08-12', None), ('2021-11-02', 'atalanta2021'), ('2018-03-23', None)],
 'messi': [('2013-03-12', None), ('2017-03-08', None), ('2010-04-06', None), ('2008-10-01', None), ('2025-04-09', None), ('2011-03-08', None), ('2026-07-07', None), ('2010-08-21', None), ('2025-08-27', None)],
}

def comebacks(p, ms, gs):
    by = collections.defaultdict(list)
    for g in gs:
        by[g['i']].append(g)
    won = lambda m: m['scoreTeam'] > m['scoreOpponent']
    w = [(i, m) for i, m in enumerate(ms) if won(m) and any(g['state'] < 0 for g in by[i])]
    d = [(i, m) for i, m in enumerate(ms) if m['scoreTeam'] == m['scoreOpponent'] and any(g['state'] < 0 for g in by[i])]
    rescued = sum(pts(m['scoreTeam'], m['scoreOpponent']) - pts(m['scoreTeam'] - sum(g['state'] < 0 for g in by[i]), m['scoreOpponent']) for i, m in enumerate(ms))
    KO = ('F', 'SF', 'QF', 'R16', 'R32')
    out = dict(wins=len(w), draws=len(d), points=rescued, koWins=sum(m['round'] in KO for _, m in w), uclWins=sum(m['competition'] == 'Champions League' for _, m in w),
               fromTwoDown=sum(any(g['state'] <= -2 for g in by[i]) for i, m in w), equalAndWin=sum(any(g['winner'] for g in by[i]) for i, m in w), late=sum(any(g['state'] < 0 and g['min'] >= 80 for g in by[i]) for i, m in w + d))
    cards = []
    for iso, clip in CURATED.get(p, []):
        i, m = next((i, m) for i, m in enumerate(ms) if m['iso'] == iso)
        cards.append(dict(iso=iso, team=m['team'], opp=m['opponent'], comp=m['competition'], round=m['round'], t=m['scoreTeam'], o=m['scoreOpponent'], clip=clip,
                          steps=[dict(min=g['stamp'], state=g['state'], pen=g['pen']) for g in by[i]], tie=bool(m['notes'] and 'leg2' in str(m['notes']))))
    out['cards'] = cards
    return out

def combos(ms):
    perfect = [dict(iso=m['iso'], opp=m['opponent'], team=m['team'], comp=m['competition']) for m in ms if m['left'] and m['right'] and m['head']]
    c = collections.Counter(min(m['goals'], 4) for m in ms if m['goals'])
    return dict(perfect=perfect, bothFeet=sum(1 for m in ms if m['left'] and m['right']), footHead=sum(1 for m in ms if m['head'] and (m['left'] or m['right'])), twoHeaders=sum(1 for m in ms if m['head'] >= 2),
                braces=c[2], trebles=c[3], fourPlus=c[4])

def minutes(gs):
    h = [0] * 19
    for g in gs:
        h[min(18, (g['min'] - 1) // 5 if g['min'] > 0 else 0)] += 1
    return dict(hist=h, covered=len({g['min'] for g in gs if 1 <= g['min'] <= 90}), stoppage=sum(g['min'] >= 90 for g in gs), extraTime=sum(g['min'] > 90 and not g['add'] for g in gs), first=sum(g['min'] <= 45 for g in gs), second=sum(g['min'] > 45 for g in gs))

def page(name):
    return json.load(open(RAW.parent / 'mvr2' / name))['result']['data']

def page1(name):
    return json.load(open(RAW / name))['result']['data']

def ranks(p):
    cap = p.capitalize()
    uefa = {e['node']['competition']: e['node'] for e in page1('all-time-stats_uefa-club-rankings.json')[f'allSheet{cap}UefaTopXStats']['edges']}
    fifa = {e['node']['competition']: e['node'] for e in page1('international-stats_fifa-rankings.json')[f'allSheet{cap}IntTopXStats']['edges']}
    pick = lambda d, ks: [dict(k=k, goals=int(d[k]['goals']), assists=int(d[k]['assists']), apps=int(d[k]['apps'])) for k in ks]
    return dict(uefa=pick(uefa, ['vs Top 1', 'vs Top 3', 'vs Top 5', 'vs Top 10', 'vs Top 20', 'vs Top 50']), fifa=pick(fifa, ['vs Top 3', 'vs Top 5', 'vs Top 10', 'vs Top 20', 'vs Top 50']))

def career_row(name, cap, key):
    rows = page(name)[f'allSheet{cap}AllTimeStats']['edges']
    return int(num(next(e['node'][key] for e in rows if e['node']['competition'] == 'All Time Career')))

def advanced(p, ms):
    cap = p.capitalize()
    per90 = {}
    for k in ('shots', 'shotsOnTarget', 'keyPasses', 'successfulDribbles', 'bigChancesCreated', 'aerialDuels', 'throughballs'):
        x = [m for m in ms if m[k] is not None]
        per90[k] = dict(total=int(sum(m[k] for m in x)), per90=round(sum(m[k] for m in x) / sum(m['minsPlayed'] for m in x) * 90, 2), matches=len(x))
    u = [m for m in ms if m['competition'] == 'Champions League']
    ko = [m for m in u if m['round'] in ('R16', 'QF', 'SF', 'F')]
    return dict(per90=per90, penWon=career_row('detailed-stats_penalties-won.json', cap, 'penWon'), fkAttempts=career_row('detailed-stats_free-kicks.json', cap, 'freeKickAttempts'),
                ucl=dict(goals=sum(m['goals'] for m in u), assists=sum(m['assists'] for m in u), koAssists=sum(m['assists'] for m in ko), koGoals=sum(m['goals'] for m in ko)))

def reach(p, ms):
    rows = list(csv.DictReader(open(RAW.parent / 'goals_master_batestguy.csv')))
    name = {'ronaldo': 'C. Ronaldo', 'messi': 'Lionel Messi'}[p]
    keepers = {r['Goalkeeper'] for r in rows if r['Player'] == name and r['Goalkeeper']}
    ven = {h: dict(apps=sum(m['homeAway'] == h for m in ms), goals=sum(m['goals'] for m in ms if m['homeAway'] == h)) for h in 'HAN'}
    sea, yr = collections.Counter(), collections.Counter()
    for m in ms:
        yr[m['year']] += m['goals']
        if m['team'] not in ('Portugal', 'Argentina'):
            sea[m['season']] += m['goals']
    best = c = 0
    for m in ms:
        c = c + 1 if m['goals'] else 0
        best = max(best, c)
    return dict(opponents=len({m['opponent'] for m in ms}), scoredAgainst=len({m['opponent'] for m in ms if m['goals']}), comps=len({m['competition'] for m in ms if m['goals']}), keepers=len(keepers), venue=ven,
                club30=sum(v >= 30 for v in sea.values()), club50=sum(v >= 50 for v in sea.values()), year40=sum(v >= 40 for v in yr.values()), year30=sum(v >= 30 for v in yr.values()), streak=best,
                years=[[k, yr[k]] for k in sorted(yr)])

def evenness(a):
    parts = [a['right'], a['left'], a['head']]
    t = sum(parts)
    return round(-sum(x / t * math.log(x / t) for x in parts) / math.log(3), 3)

def padding(ms, gs):
    """One bitmask per goal, plus the totals the padding chapter quotes.
    1 win by 4+, 2 v a bottom-three league side, 4 friendly, 8 for his country, 16 v one of his ten most-scored-against opponents."""
    v = collections.Counter()
    for m in ms:
        v[m['opponent']] += m['goals']
    top = {k for k, _ in v.most_common(10)}
    def bottom3(m):
        try:
            pos = int(m['opponentLeaguePosition'])
        except (TypeError, ValueError):
            return False
        size = 18 if m['competition'] == 'Ligue 1' and m['season'] == '2023-2024' else 20
        return m['competition'] in ('La Liga', 'Premier League', 'Serie A', 'Ligue 1') and pos >= size - 2
    flags = []
    for g in gs:
        m = ms[g['i']]
        f = (m['scoreTeam'] - m['scoreOpponent'] >= 4) * 1 + bottom3(m) * 2 + (m['competition'] == 'International Friendly') * 4 + (m['team'] in ('Portugal', 'Argentina')) * 8 + (m['opponent'] in top) * 16
        flags.append(int(f))
    n = lambda bit: sum(1 for f in flags if f & bit)
    fr = [m for m in ms if m['competition'] == 'International Friendly']
    nat = [m for m in ms if m['team'] in ('Portugal', 'Argentina')]
    b3 = [m for m in ms if bottom3(m)]
    marg = lambda m: m['scoreTeam'] - m['scoreOpponent']
    club = [m for m in ms if m['team'] not in ('Portugal', 'Argentina')]
    rate = lambda x: round(sum(m['goals'] for m in x) / len(x), 2)
    return flags, dict(blowout=n(1), bottom3=n(2), bottom3Apps=len(b3), friendly=n(4), friendlyApps=len(fr), intl=n(8), top10=n(16), friendlyHats=sum(m['goals'] >= 3 for m in fr), intlHats=sum(m['goals'] >= 3 for m in nat),
                       competitive=n(8) - n(4), threeUp=sum(g['state'] >= 3 for g in gs), blowoutAssists=sum(m['assists'] for m in ms if marg(m) >= 4), clubHome=rate([m for m in club if m['homeAway'] == 'H']), clubAway=rate([m for m in club if m['homeAway'] == 'A']), ptsPerGoal=round(sum(pts(m['scoreTeam'], m['scoreOpponent']) - pts(m['scoreTeam'] - m['goals'], m['scoreOpponent']) for m in ms) / len(gs), 2))

GIANTS = ['Bayern Munich', 'Juventus', 'Borussia Dortmund', 'Tottenham Hotspur', 'Inter Milan', 'Napoli', 'Atletico Madrid', 'Paris Saint-Germain', 'Manchester City', 'AC Milan', 'Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
MAJOR = ('Champions League', 'World Cup', 'UEFA European Championships', 'Copa America', 'UEFA Nations League', 'Club World Cup')

def big(p, ms, gs, T):
    """Important matches: ties his goals decided, late knockout goals, semis and finals, named opponents."""
    KO = ('R16', 'QF', 'SF', 'F')
    won = [t for t in T if t['comp'] == 'Champions League' and t['won']]
    flip = [t for t in won if t['status'] == 'out' and t['removed'] > 0]
    ucl = lambda g: ms[g['i']]['competition'] == 'Champions League' and ms[g['i']]['round'] in KO
    late = [m for m in ms if m['round'] in ('SF', 'F') and m['competition'] in MAJOR]
    cap = p.capitalize()
    fifa = {e['node']['competition']: e['node'] for e in page1('international-stats_fifa-rankings.json')[f'allSheet{cap}IntTopXStats']['edges']}
    comp = lambda k: dict(goals=int(fifa[k]['goals']), apps=int(fifa[k]['apps']))
    giants = {}
    for g in GIANTS:
        x = [m for m in ms if m['opponent'] == g]
        giants[g] = dict(goals=sum(m['goals'] for m in x), apps=len(x))
    return dict(tiesWon=len(won), tiesDecided=len(flip), ties=[dict(opp=t['opp'], year=t['season'][5:], round=t['round'], was=f"{t['gf']}-{t['ga']}", now=f"{t['gf2']}-{t['ga']}") for t in flip],
                koHats=sum(1 for m in ms if m['competition'] == 'Champions League' and m['round'] in KO and m['goals'] >= 3), koLate=sum(1 for g in gs if ucl(g) and g['min'] >= 80 and g['state'] in (0, -1)), koWinners=sum(1 for g in gs if ucl(g) and g['winner']),
                semisFinals=dict(goals=sum(m['goals'] for m in late), apps=len(late)), intlTop10=comp('vs Top 10 Competitive'), intlTop5=comp('vs Top 5 Competitive'), giants=giants)

def extras(p, ms, gs, anatomy, T):
    sh, sm = shots(p, ms, gs)
    pf, pad = padding(ms, gs)
    pf = [f + (32 if g['winner'] else 0) + (64 if g['state'] <= 0 else 0) for f, g in zip(pf, gs)]
    st = lambda f: sum(1 for g in gs if f(g))
    res = lambda m: 'W' if m['scoreTeam'] > m['scoreOpponent'] else 'D' if m['scoreTeam'] == m['scoreOpponent'] else 'L'
    return dict(padFlags=pf, pad=pad, big=big(p, ms, gs, T), shots=sh, map=sm, comebacks=comebacks(p, ms, gs), combos=combos(ms), minutes=minutes(gs), ranks=ranks(p), advanced=advanced(p, ms), reach=reach(p, ms), evenness=evenness(anatomy),
                state3=dict(behind=st(lambda g: g['state'] < 0), level=st(lambda g: g['state'] == 0), ahead=st(lambda g: g['state'] > 0)), inResult={k: sum(m['goals'] for m in ms if res(m) == k) for k in 'WDL'})
