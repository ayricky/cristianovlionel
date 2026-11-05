"""Compute every number on the site from the raw logs. Output: ../../src/data/site.json"""
import collections, csv, datetime as dt, json, math, pathlib, re
from load import load, RAW
from leagues import link, rank, replay, NAME, CODE, season_rows
from ties import ties
from extras import extras

ROOT = pathlib.Path(__file__).resolve().parents[2]
DOB = {'ronaldo': dt.date(1985, 2, 5), 'messi': dt.date(1987, 6, 24)}
pts = lambda a, b: 3 if a > b else 1 if a == b else 0
res = lambda a, b: 'W' if a > b else 'D' if a == b else 'L'

# ---------------------------------------------------------------- trophies
EXTRA = {
    ('Champions League', '2007-2008', 'QF', 'Roma'): ('H', 1, 0),
    ('Champions League', '2013-2014', 'QF', 'Borussia Dortmund'): ('A', 0, 2),
    ('Champions League', '2015-2016', 'SF', 'Manchester City'): ('A', 0, 0),
}
TROPHY = {
 'ronaldo': [
  ('Champions League','2007-2008','Manchester United'),('Champions League','2013-2014','Real Madrid'),('Champions League','2015-2016','Real Madrid'),('Champions League','2016-2017','Real Madrid'),('Champions League','2017-2018','Real Madrid'),
  ('FA Cup','2003-2004','Manchester United'),('League Cup','2005-2006','Manchester United'),('League Cup','2008-2009','Manchester United'),
  ('Copa del Rey','2010-2011','Real Madrid'),('Copa del Rey','2013-2014','Real Madrid'),('Coppa Italia','2020-2021','Juventus'),
  ('Supertaça','2002-2003','Sporting CP'),('FA Community Shield','2007-2008','Manchester United'),('Supercopa de Espana','2012-2013','Real Madrid'),('Supercopa de Espana','2017-2018','Real Madrid'),('Supercoppa Italiana','2018-2019','Juventus'),('Supercoppa Italiana','2020-2021','Juventus'),
  ('UEFA Super Cup','2014-2015','Real Madrid'),('UEFA Super Cup','2017-2018','Real Madrid'),
  ('Club World Cup','2008-2009','Manchester United'),('Club World Cup','2014-2015','Real Madrid'),('Club World Cup','2016-2017','Real Madrid'),('Club World Cup','2017-2018','Real Madrid'),
  ('Arab Club Champions Cup','2023-2024','Al Nassr'),('UEFA European Championships','2015-2016','Portugal'),('UEFA Nations League','2018-2019','Portugal'),('UEFA Nations League','2024-2025','Portugal'),
 ],
 'messi': [
  ('Champions League','2005-2006','Barcelona'),('Champions League','2008-2009','Barcelona'),('Champions League','2010-2011','Barcelona'),('Champions League','2014-2015','Barcelona'),
  *[('Copa del Rey',s,'Barcelona') for s in ('2008-2009','2011-2012','2014-2015','2015-2016','2016-2017','2017-2018','2020-2021')],
  *[('Supercopa de Espana',s,'Barcelona') for s in ('2006-2007','2009-2010','2010-2011','2011-2012','2013-2014','2016-2017','2018-2019')],
  ('Trophée des Champions','2022-2023','Paris Saint-Germain'),
  *[('UEFA Super Cup',s,'Barcelona') for s in ('2009-2010','2011-2012','2015-2016')],
  *[('Club World Cup',s,'Barcelona') for s in ('2009-2010','2011-2012','2015-2016')],
  ('World Cup','2022-2023','Argentina'),('Copa America','2020-2021','Argentina'),('Copa America','2023-2024','Argentina'),('Finalissima','2021-2022','Argentina'),
  ('Leagues Cup','2023-2024','Inter Miami'),('Campeones Cup','2026-2027','Inter Miami'),('MLS Cup','2025-2026','Inter Miami'),
 ],
}
# Group-stage exits worked out by hand from the published tables; see data/METHOD.md
GROUP_OVERRIDE = {
 'goals': {
  ('ronaldo','UEFA European Championships','2015-2016'): 'Group F: 3-3 v Hungary becomes 1-3. Portugal finish on 2 points, and every third-placed team that qualified had at least 3.',
  ('messi','Champions League','2008-2009'): 'Group C: 2-1 at Shakhtar becomes 0-1 and 1-1 v Basel becomes 0-1. Barcelona drop to 9 points, behind Sporting and Shakhtar on 12.',
 }
}
SHORT = {'UEFA European Championships':'Euro','UEFA Nations League':'Nations League','Supercopa de Espana':'Supercopa de España','FA Community Shield':'Community Shield','Trophée des Champions':'Trophée des Champions'}

def apply_extra(T):
    for t in T:
        k = (t['comp'], t['season'], t['round'], t['opp'])
        if k in EXTRA:
            ha, f, a = EXTRA[k]
            t['gf'] += f; t['ga'] += a; t['gf2'] += f
            t['legs'] = 2
            af = sum(s[1] for s in t['scores'] if s[0] == 'A') + (f if ha == 'A' else 0)
            af2 = sum(s[1] - s[3] for s in t['scores'] if s[0] == 'A') + (f if ha == 'A' else 0)
            ag = sum(s[2] for s in t['scores'] if s[0] == 'H') + (a if ha == 'H' else 0)
            t['scores'].append((ha, f, a, 0))
            if t['gf2'] > t['ga']: t['status'] = 'through'
            elif t['gf2'] < t['ga']: t['status'] = 'out'
            else: t['status'] = 'through' if af2 > ag else 'out' if af2 < ag else 'level'
    return T

def trophy_table(p, ms, take, label):
    T = apply_extra(ties(ms, take))
    out = []
    for comp, season, team in TROPHY[p]:
        run = [t for t in T if t['comp'] == comp and t['season'] == season]
        ov = GROUP_OVERRIDE.get(label, {}).get((p, comp, season))
        if label == 'assists' and (p, comp, season) in GROUP_OVERRIDE['goals']:
            ov = GROUP_OVERRIDE['goals'][(p, comp, season)]
        status, why = 'safe', None
        killers = [t for t in run if t['status'] == 'out' and t['removed'] > 0]
        doubts = [t for t in run if t['status'] == 'level' and t['removed'] > 0]
        if ov:
            status, why = 'gone', ov
        elif killers:
            t = killers[-1]
            status = 'gone'
            why = f"{t['round']} v {t['opp']}: {t['gf']}-{t['ga']} becomes {t['gf2']}-{t['ga']}"
        elif doubts:
            t = doubts[-1]
            status = 'doubt'
            why = 'Best-of-three v Nashville goes to a shootout' if comp == 'MLS Cup' else f"{t['round']} v {t['opp']}: {t['gf']}-{t['ga']} becomes {t['gf2']}-{t['ga']}, level"
        out.append(dict(comp=SHORT.get(comp, comp), season=season, team=team, status=status, why=why,
                        kind='europe' if comp in ('Champions League',) else 'nation' if team in ('Portugal','Argentina') else 'cup',
                        ties=[dict(round=t['round'], opp=t['opp'], gf=t['gf'], ga=t['ga'], gf2=t['gf2'], removed=t['removed'], status=t['status'], pen=t['pen']) for t in run]))
    return out

# ---------------------------------------------------------------- leagues
OTHER_LEAGUES = {
 'ronaldo': [dict(comp='Saudi Pro League', season='2025-2026', team='Al Nassr', table=[('Al Nassr',86),('Al Hilal',84),('Al Ahli',81),('Al Qadsiah',77)])],
 'messi': [dict(comp='MLS Supporters\' Shield', season='2024', team='Inter Miami', table=[('Inter Miami',74),('Columbus Crew',66),('LAFC',64),('LA Galaxy',64),('Cincinnati',59)])],
}

OPP_ALIAS = {'Los Angeles FC': 'LAFC', 'LA Galaxy': 'LA Galaxy', 'Los Angeles Galaxy': 'LA Galaxy', 'FC Cincinnati': 'Cincinnati', 'Columbus Crew': 'Columbus'}

def league_block(p, ms):
    linked, ok, bad = link(p)
    assert not bad
    rows_out = []
    for (comp, season, team), (rows, lst) in sorted(linked.items(), key=lambda x: x[0][1]):
        tn = NAME[team]
        order, t = rank(rows, comp)
        ord2, t2 = rank(replay(rows, lst, lambda m: m['goals']), comp)
        ord3, t3 = rank(replay(rows, lst, lambda m: m['goals'] + m['assists']), comp)
        flipped = []
        for m in lst:
            a, b = pts(m['scoreTeam'], m['scoreOpponent']), pts(m['scoreTeam'] - m['goals'], m['scoreOpponent'])
            if a != b:
                flipped.append(dict(opp=m['opponent'], iso=m['iso'], ha=m['homeAway'], t=m['scoreTeam'], o=m['scoreOpponent'], g=m['goals'], lost=a - b))
        top = lambda ord_, tb: [dict(team=k, p=tb[k]['p'], gd=tb[k]['gf'] - tb[k]['ga']) for k in ord_[:6]]
        team_rows = dict(comp=comp, season=season, team=team, label=tn, played=len(lst), of=t[tn]['pl'], goals=sum(m['goals'] for m in lst),
                         pos=order.index(tn) + 1, pos2=ord2.index(tn) + 1, pos3=ord3.index(tn) + 1, pts=t[tn]['p'], pts2=t2[tn]['p'], gf=t[tn]['gf'], ga=t[tn]['ga'],
                         champion=order[0], champion2=ord2[0], champion3=ord3[0], before=top(order, t), after=top(ord2, t2), flipped=flipped,
                         title=order[0] == tn, kept=ord2[0] == tn, kept3=ord3[0] == tn)
        rows_out.append(team_rows)
    return rows_out, ok

def other_league(p, ms):
    out = []
    for o in OTHER_LEAGUES[p]:
        if p == 'ronaldo':
            lst = [m for m in ms if m['competition'] == 'Saudi Pro League' and m['season'] == o['season']]
        else:
            lst = [m for m in ms if m['competition'] == 'MLS' and m['iso'][:4] == o['season']]
        before = dict(o['table'])
        after = dict(before)
        flipped = []
        for m in lst:
            a, b = pts(m['scoreTeam'], m['scoreOpponent']), pts(m['scoreTeam'] - m['goals'], m['scoreOpponent'])
            if a != b:
                flipped.append(dict(opp=m['opponent'], iso=m['iso'], ha=m['homeAway'], t=m['scoreTeam'], o=m['scoreOpponent'], g=m['goals'], lost=a - b))
                after[o['team']] -= a - b
                gain = pts(m['scoreOpponent'], m['scoreTeam'] - m['goals']) - pts(m['scoreOpponent'], m['scoreTeam'])
                for k in after:
                    if k.lower().replace(' crew', '') == OPP_ALIAS.get(m['opponent'], m['opponent']).replace('-', ' ').lower():
                        after[k] += gain
        b = sorted(before, key=lambda k: -before[k])
        c = sorted(after, key=lambda k: -after[k])
        a3 = dict(before)
        for m in lst:
            a3[o['team']] -= pts(m['scoreTeam'], m['scoreOpponent']) - pts(m['scoreTeam'] - m['goals'] - m['assists'], m['scoreOpponent'])
        out.append(dict(comp=o['comp'], season=o['season'], team=o['team'], label=o['team'], played=len(lst), of=34, goals=sum(m['goals'] for m in lst),
                        pos=1, pos2=c.index(o['team']) + 1, pos3=None, pts=before[o['team']], pts2=after[o['team']], champion=b[0], champion2=c[0], champion3=None,
                        before=[dict(team=k, p=before[k]) for k in b], after=[dict(team=k, p=after[k]) for k in c], flipped=flipped, title=True, kept=c[0] == o['team'], kept3=False))
    return out

# ---------------------------------------------------------------- goals, one row per goal
GOAL = re.compile(r"(?P<state>wb\d+|lb\d+|dr),(?P<min>\d+)(?:\+(?P<add>\d+))?'(?P<pen>,\(p\))?")

def goal_rows(ms):
    rows = []
    for i, m in enumerate(ms):
        if not m['goals']:
            continue
        parts = m['goalTimes'].split('|')
        win = None
        for x in parts:
            if x.startswith(('gwg', 'mw')):
                win = x.split(',')[1].rstrip("'").split('(')[0]
        for x in parts:
            if x.startswith(('gwg', 'mw')):
                continue
            g = GOAL.match(x)
            assert g, x
            state = 0 if g['state'] == 'dr' else int(g['state'][2:]) * (1 if g['state'][0] == 'w' else -1)
            mn = int(g['min']); add = int(g['add'] or 0)
            stamp = f"{mn}+{add}" if add else f"{mn}"
            pen = bool(g['pen']) or '(p)' in x
            rows.append(dict(i=i, min=mn, add=add, state=state, pen=pen, winner=False, stamp=stamp))
        cand = [r for r in rows if r['i'] == i]
        # A few rows tag a penalty the match line does not count, or the reverse. The match line sets the headline total.
        tagged = [r for r in cand if r['pen']]
        for r in tagged[m['pens']:]:
            r['pen'] = False
        for r in [r for r in reversed(cand) if not r['pen']][:max(0, m['pens'] - len(tagged))]:
            r['pen'] = True
        if win is not None:
            w = [r for r in cand if r['stamp'] == win.replace("'", '')]
            (w[0] if w else cand[-1])['winner'] = True
    return rows

def clutch(ms, gs):
    n = len(gs)
    def block(g):
        d = dict(total=len(g))
        d['winners'] = sum(r['winner'] for r in g)
        d['goAhead'] = sum(r['state'] == 0 for r in g)
        d['equalisers'] = sum(r['state'] == -1 for r in g)
        d['behind'] = sum(r['state'] < -1 for r in g)
        d['padding'] = sum(r['state'] >= 2 for r in g)
        d['oneUp'] = sum(r['state'] == 1 for r in g)
        d['late'] = sum(r['state'] in (0, -1) and r['min'] >= 80 for r in g)
        d['last'] = sum(r['state'] in (0, -1) and r['min'] >= 90 for r in g)
        d['lateWinners'] = sum(r['winner'] and r['min'] >= 80 for r in g)
        return d
    out = dict(all=block(gs), nonPen=block([r for r in gs if not r['pen']]))
    onenil = sum(1 for m in ms if m['goals'] and m['scoreTeam'] == m['goals'] and m['scoreOpponent'] == m['goals'] - 1)
    only = sum(1 for m in ms if m['goals'] == 1 and m['scoreTeam'] == 1 and m['scoreOpponent'] == 0)
    allg = sum(1 for m in ms if m['goals'] and m['goals'] == m['scoreTeam'] and m['scoreTeam'] > m['scoreOpponent'])
    out['soleGoal1_0'] = only
    out['allTeamGoalsInWin'] = allg
    bigs = [m for m in ms if m['round'] in ('F', 'SF', 'QF')]
    bi = {id(m) for m in bigs}
    out['ko'] = block([r for r in gs if ms[r['i']]['round'] in ('F', 'SF', 'QF', 'R16', 'R32')])
    return out

# ---------------------------------------------------------------- summaries
def erase_summary(ms, take=lambda m: m['goals']):
    c = collections.Counter()
    for m in ms:
        T, O, k = m['scoreTeam'], m['scoreOpponent'], take(m)
        a, b = res(T, O), res(T - k, O)
        c['matches'] += 1; c[a] += 1
        if a != b:
            c['flips'] += 1; c[f'{a}{b}'] += 1
        c['pts'] += pts(T, O) - pts(T - k, O)
    return c

def anatomy(ms):
    c = collections.Counter()
    for m in ms:
        for k in ('left', 'right', 'head', 'other', 'insideBox', 'outsideBox', 'freeKicks', 'pens', 'goals', 'pensMissed', 'hatTricks'):
            c[k] += m[k]
    return dict(c)

def stage(ms):
    d = {}
    ucl = [m for m in ms if m['competition'] == 'Champions League']
    for r, label in (('Group', 'Group'), ('R16', 'R16'), ('QF', 'QF'), ('SF', 'SF'), ('F', 'F')):
        x = [m for m in ucl if m['round'] == r]
        d[label] = dict(apps=len(x), goals=sum(m['goals'] for m in x), assists=sum(m['assists'] for m in x), mins=sum(m['minsPlayed'] for m in x))
    finals = [m for m in ms if m['round'] == 'F']
    fin = []
    for m in finals:
        won = m['scoreTeam'] > m['scoreOpponent']
        if m['penScore']:
            a, b = map(int, m['penScore'].split('-')); won = a > b
        fin.append(dict(iso=m['iso'], comp=m['competition'], opp=m['opponent'], t=m['scoreTeam'], o=m['scoreOpponent'], pen=m['penScore'], g=m['goals'], a=m['assists'], won=won, team=m['team'], notes=m['notes']))
    d['finals'] = fin
    d['finalsSummary'] = dict(n=len(fin), goals=sum(f['g'] for f in fin), assists=sum(f['a'] for f in fin), won=sum(f['won'] for f in fin))
    ko = [m for m in ms if m['round'] in ('F', 'SF', 'QF', 'R16')]
    d['allKO'] = dict(apps=len(ko), goals=sum(m['goals'] for m in ko), assists=sum(m['assists'] for m in ko))
    late = [m for m in ms if m['round'] in ('F', 'SF', 'QF')]
    d['qfPlus'] = dict(apps=len(late), goals=sum(m['goals'] for m in late), assists=sum(m['assists'] for m in late))
    uclLate = [m for m in ucl if m['round'] in ('F', 'SF', 'QF')]
    d['uclQfPlus'] = dict(apps=len(uclLate), goals=sum(m['goals'] for m in uclLate))
    return d

def burden(ms):
    by = collections.defaultdict(lambda: collections.Counter())
    for m in ms:
        b = by[m['team']]
        b['apps'] += 1; b['goals'] += m['goals']; b['assists'] += m['assists']; b['teamGoals'] += m['scoreTeam']; b['pens'] += m['pens']
        b['wins'] += m['scoreTeam'] > m['scoreOpponent']
    out = {k: dict(v, share=round(v['goals'] / v['teamGoals'], 4)) for k, v in by.items()}
    tg = sum(m['scoreTeam'] for m in ms)
    return out, tg

def age_curve(p, ms):
    dob = DOB[p]
    cum, out = 0, {}
    for m in ms:
        d = dt.date.fromisoformat(m['iso'])
        age = (d - dob).days / 365.25
        cum += m['goals']
        out[int(age)] = cum
    pts_cum, series = 0, []
    cg = 0
    for m in ms:
        d = dt.date.fromisoformat(m['iso'])
        cg += m['goals']
        if m['goals']:
            series.append([round((d - dob).days / 365.25, 3), cg])
    return out, series

def age_bins(p, ms):
    dob = DOB[p]
    b = collections.defaultdict(lambda: collections.Counter())
    for m in ms:
        a = int((dt.date.fromisoformat(m['iso']) - dob).days / 365.25)
        b[a]['apps'] += 1; b[a]['goals'] += m['goals']; b[a]['mins'] += m['minsPlayed']; b[a]['pens'] += m['pens']
        b[a]['flipPts'] += pts(m['scoreTeam'], m['scoreOpponent']) - pts(m['scoreTeam'] - m['goals'], m['scoreOpponent'])
    return {k: dict(v) for k, v in sorted(b.items())}

def calendar(ms):
    y = collections.defaultdict(lambda: collections.Counter())
    for m in ms:
        y[m['year']]['goals'] += m['goals']; y[m['year']]['apps'] += 1; y[m['year']]['assists'] += m['assists']
    return {k: dict(v) for k, v in sorted(y.items())}

def by_comp(ms):
    c = collections.defaultdict(lambda: collections.Counter())
    for m in ms:
        b = c[m['competition']]
        b['apps'] += 1; b['goals'] += m['goals']; b['assists'] += m['assists']
    return {k: dict(v) for k, v in sorted(c.items(), key=lambda x: -x[1]['goals'])}

def vs_top(ms):
    x = [m for m in ms if str(m.get('opponentLeaguePosition') or '') in ('1', '2', '3') and m['competition'] in ('La Liga', 'Premier League', 'Serie A', 'Ligue 1')]
    return dict(apps=len(x), goals=sum(m['goals'] for m in x), assists=sum(m['assists'] for m in x), pens=sum(m['pens'] for m in x))

def compact(ms):
    comps = sorted({m['competition'] for m in ms})
    teams = sorted({m['team'] for m in ms})
    rows = []
    for m in ms:
        rows.append([m['iso'], comps.index(m['competition']), teams.index(m['team']), m['opponent'], m['homeAway'], m['scoreTeam'], m['scoreOpponent'], m['goals'], m['assists'], m['pens'], m['round'] or '', m['minsPlayed'], m['penScore'] or ''])
    return dict(comps=comps, teams=teams, rows=rows)

def with_without(p, ms):
    linked, _, _ = link(p)
    out = {}
    for (comp, season, team), (rows, lst) in linked.items():
        tn = NAME[team]
        mine = [r for r in rows if tn in (r['home'], r['away'])]
        ids = {(m['_row']['date'], m['_row']['home']) for m in lst if m.get('_row')}
        b = out.setdefault(team, collections.Counter())
        for r in mine:
            h = r['home'] == tn
            T, O = (r['hg'], r['ag']) if h else (r['ag'], r['hg'])
            k = 'on' if (r['date'], r['home']) in ids else 'off'
            b[k + 'G'] += 1; b[k + 'P'] += pts(T, O); b[k + 'F'] += T; b[k + 'A'] += O
    return {k: dict(v, onPPG=round(v['onP'] / max(v['onG'], 1), 3), offPPG=round(v['offP'] / max(v['offG'], 1), 3)) for k, v in out.items()}

MOVES = [
 ('ronaldo', 'left', 'Manchester United', 'Man United', 'Premier League', '2008-2009', '2009-2010'),
 ('ronaldo', 'joined', 'Real Madrid', 'Real Madrid', 'La Liga', '2008-2009', '2009-2010'),
 ('ronaldo', 'left', 'Real Madrid', 'Real Madrid', 'La Liga', '2017-2018', '2018-2019'),
 ('ronaldo', 'joined', 'Juventus', 'Juventus', 'Serie A', '2017-2018', '2018-2019'),
 ('ronaldo', 'left', 'Juventus', 'Juventus', 'Serie A', '2020-2021', '2021-2022'),
 ('ronaldo', 'joined', 'Manchester United', 'Man United', 'Premier League', '2020-2021', '2021-2022'),
 ('ronaldo', 'left', 'Manchester United', 'Man United', 'Premier League', '2021-2022', '2022-2023'),
 ('messi', 'left', 'Barcelona', 'Barcelona', 'La Liga', '2020-2021', '2021-2022'),
 ('messi', 'joined', 'Paris Saint-Germain', 'Paris SG', 'Ligue 1', '2020-2021', '2021-2022'),
 ('messi', 'left', 'Paris Saint-Germain', 'Paris SG', 'Ligue 1', '2022-2023', '2023-2024'),
]
def moves():
    out = []
    for p, kind, team, tn, comp, a, b in MOVES:
        o1, t1 = rank(season_rows(comp, a), comp)
        o2, t2 = rank(season_rows(comp, b), comp)
        pl = lambda t: t[tn]['pl']
        out.append(dict(player=p, kind=kind, team=team, comp=comp, a=a, b=b, ptsA=t1[tn]['p'], ptsB=t2[tn]['p'], gfA=t1[tn]['gf'], gfB=t2[tn]['gf'], posA=o1.index(tn) + 1, posB=o2.index(tn) + 1, plA=pl(t1), plB=pl(t2)))
    return out

def head2head():
    r, m = load('ronaldo'), load('messi')
    idx = {x['iso']: x for x in m}
    out = []
    for a in r:
        b = idx.get(a['iso'])
        if b and a['opponent'] in (b['team'],) or (b and b['opponent'] == a['team']):
            out.append(dict(iso=a['iso'], comp=a['competition'], team=a['team'], opp=a['opponent'], t=a['scoreTeam'], o=a['scoreOpponent'], rg=a['goals'], ra=a['assists'], mg=b['goals'], ma=b['assists']))
    return out

def player(p):
    ms = load(p)
    gs = goal_rows(ms)
    assert len(gs) == sum(m['goals'] for m in ms)
    leagues, ok = league_block(p, ms)
    leagues += other_league(p, ms)
    titles = [l for l in leagues if l['title']]
    tr = trophy_table(p, ms, lambda m: m['goals'], 'goals')
    tr3 = trophy_table(p, ms, lambda m: m['goals'] + m['assists'], 'assists')
    lg_tr = [dict(comp=l['comp'], season=l['season'], team=l['team'], status='safe' if l['kept'] else 'gone', kind='league', why=None if l['kept'] else f"{l['pts']} points becomes {l['pts2']}. {l['champion2']} win it.", ties=[]) for l in titles]
    lg_tr3 = [dict(status='safe' if l['kept3'] else 'gone', kind='league') for l in titles]
    allT = lg_tr + tr
    cnt = collections.Counter(t['status'] for t in allT)
    cnt3 = collections.Counter(t['status'] for t in lg_tr3 + tr3)
    e = erase_summary(ms)
    e3 = erase_summary(ms, lambda m: m['goals'] + m['assists'])
    enp = erase_summary(ms, lambda m: m['goals'] - m['pens'])
    club = [m for m in ms if m['team'] not in ('Portugal', 'Argentina')]
    intl = [m for m in ms if m['team'] in ('Portugal', 'Argentina')]
    lg = [m for m in ms if m['competition'] in ('La Liga', 'Premier League', 'Serie A', 'Ligue 1', 'Saudi Pro League', 'MLS', 'Primeira Liga')]
    ko = [m for m in ms if m['round'] in ('F', 'SF', 'QF', 'R16', 'R32', 'R64', 'R96')]
    bur, tg = burden(ms)
    age, series = age_curve(p, ms)
    bins = age_bins(p, ms)
    a30 = sum(v['goals'] for k, v in bins.items() if k >= 30)
    a35 = sum(v['goals'] for k, v in bins.items() if k >= 35)
    a30np = sum(v['goals'] - v.get('pens', 0) for k, v in bins.items() if k >= 30)
    return dict(
        totals=dict(apps=len(ms), goals=sum(m['goals'] for m in ms), assists=sum(m['assists'] for m in ms), allAssists=sum(m['allAssists'] for m in ms), mins=sum(m['minsPlayed'] for m in ms), pens=sum(m['pens'] for m in ms), pensMissed=sum(m['pensMissed'] for m in ms), first=ms[0]['iso'], last=ms[-1]['iso'], wins=sum(m['scoreTeam'] > m['scoreOpponent'] for m in ms), teamGoals=tg, leagueValidated=ok),
        erase=dict(goals=dict(e), goalsAssists=dict(e3), nonPen=dict(enp), club=dict(erase_summary(club)), intl=dict(erase_summary(intl)), league=dict(erase_summary(lg)), ko=dict(erase_summary(ko))),
        trophies=allT, trophyCount=dict(cnt, total=len(allT)), trophyCountAssists=dict(cnt3, total=len(lg_tr3 + tr3)), leagues=leagues,
        clutch=clutch(ms, gs), anatomy=anatomy(ms), stage=stage(ms), burden=bur, age=age, ageSeries=series, ageBins=bins, after30=a30, after35=a35, after30np=a30np,
        calendar=calendar(ms), byComp=by_comp(ms), vsTop=vs_top(ms), withWithout=with_without(p, ms), club=dict(apps=len(club), goals=sum(m['goals'] for m in club), assists=sum(m['assists'] for m in club)), intl=dict(apps=len(intl), goals=sum(m['goals'] for m in intl), assists=sum(m['assists'] for m in intl)),
        matches=compact(ms), goals=[[g['i'], g['min'], g['add'], g['state'], int(g['pen']), int(g['winner'])] for g in gs],
        **extras(p, ms, gs, anatomy(ms), apply_extra(ties(ms))),
    )

site = dict(generated='2026-11-05', ronaldo=player('ronaldo'), messi=player('messi'), moves=moves(), h2h=head2head())
(ROOT / 'src' / 'data').mkdir(parents=True, exist_ok=True)
json.dump(site, open(ROOT / 'src' / 'data' / 'site.json', 'w'), separators=(',', ':'), ensure_ascii=False)
print('wrote', (ROOT / 'src' / 'data' / 'site.json').stat().st_size)
