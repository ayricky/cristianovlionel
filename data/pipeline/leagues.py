"""Rebuild each league season from football-data.co.uk results, then replay it with a player's goals removed."""
import csv, pathlib, datetime as dt, collections
from load import load
RAW = pathlib.Path(__file__).resolve().parents[1] / 'raw' / 'football-data'
CODE = {'Premier League': 'E0', 'La Liga': 'SP1', 'Serie A': 'I1', 'Ligue 1': 'F1'}
NAME = {'Manchester United': 'Man United', 'Real Madrid': 'Real Madrid', 'Juventus': 'Juventus', 'Barcelona': 'Barcelona', 'Paris Saint-Germain': 'Paris SG'}

def pdate(s):
    for f in ('%d/%m/%Y', '%d/%m/%y'):
        try:
            return dt.datetime.strptime(s, f).date()
        except ValueError:
            pass
    raise ValueError(s)

def season_rows(comp, season):
    y = season.split('-')
    tag = y[0][2:] + y[1][2:]
    rows = []
    with open(RAW / f'{CODE[comp]}_{tag}.csv', encoding='latin-1') as f:
        for r in csv.DictReader(f):
            if not r.get('HomeTeam') or r.get('FTHG') in (None, ''):
                continue
            rows.append(dict(date=pdate(r['Date']), home=r['HomeTeam'], away=r['AwayTeam'], hg=int(r['FTHG']), ag=int(r['FTAG'])))
    return rows

def table(rows):
    t = collections.defaultdict(lambda: dict(p=0, gf=0, ga=0, w=0, d=0, l=0, pl=0))
    for r in rows:
        h, a = t[r['home']], t[r['away']]
        h['gf'] += r['hg']; h['ga'] += r['ag']; a['gf'] += r['ag']; a['ga'] += r['hg']
        h['pl'] += 1; a['pl'] += 1
        if r['hg'] > r['ag']:
            h['p'] += 3; h['w'] += 1; a['l'] += 1
        elif r['hg'] < r['ag']:
            a['p'] += 3; a['w'] += 1; h['l'] += 1
        else:
            h['p'] += 1; a['p'] += 1; h['d'] += 1; a['d'] += 1
    return t

H2H_FIRST = {'SP1', 'I1'}

def rank(rows, comp):
    t = table(rows)
    code = CODE[comp]
    def h2h(team, others):
        sub = [r for r in rows if r['home'] in others and r['away'] in others]
        s = table(sub)[team]
        return (s['p'], s['gf'] - s['ga'])
    groups = collections.defaultdict(list)
    for k, v in t.items():
        groups[v['p']].append(k)
    def key(k):
        v = t[k]
        tied = groups[v['p']]
        hh = h2h(k, set(tied)) if code in H2H_FIRST and len(tied) > 1 else (0, 0)
        return (-v['p'], -hh[0], -hh[1], -(v['gf'] - v['ga']), -v['gf'], k)
    order = sorted(t, key=key)
    return order, t

def link(player):
    """Attach each league match in the log to its football-data row; report any score disagreement."""
    ms = load(player)
    bad, ok = [], 0
    seasons = collections.defaultdict(list)
    for m in ms:
        if m['competition'] not in CODE or m['team'] not in NAME:
            continue
        seasons[(m['competition'], m['season'], m['team'])].append(m)
    linked = {}
    for (comp, season, team), lst in seasons.items():
        rows = season_rows(comp, season)
        tn = NAME[team]
        mine = [r for r in rows if tn in (r['home'], r['away'])]
        for m in lst:
            d = dt.date.fromisoformat(m['iso'])
            c = sorted((abs((r['date'] - d).days), i) for i, r in enumerate(mine))
            r = mine[c[0][1]]
            if c[0][0] > 2:
                bad.append(('nodate', m['iso'], m['opponent'])); continue
            home = r['home'] == tn
            T, O = (r['hg'], r['ag']) if home else (r['ag'], r['hg'])
            if (T, O) != (m['scoreTeam'], m['scoreOpponent']):
                bad.append(('score', m['iso'], m['opponent'], (m['scoreTeam'], m['scoreOpponent']), (T, O)))
            else:
                ok += 1
            m['_row'] = r
            m['_home'] = home
        linked[(comp, season, team)] = (rows, lst)
    return linked, ok, bad

def replay(rows, lst, take):
    """take(m) -> goals to remove from his team in match m."""
    rows = [dict(r) for r in rows]
    idx = {id(r0): i for i, r0 in enumerate([])}
    lookup = {(r['date'], r['home'], r['away']): r for r in rows}
    for m in lst:
        r0 = m.get('_row')
        if not r0:
            continue
        r = lookup[(r0['date'], r0['home'], r0['away'])]
        k = take(m)
        if m['_home']:
            r['hg'] -= k
        else:
            r['ag'] -= k
    return rows
