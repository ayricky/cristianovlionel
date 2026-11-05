"""Load both match logs into plain dicts with numeric fields and ISO dates."""
import json, pathlib, re
RAW = pathlib.Path(__file__).resolve().parents[1] / 'raw' / 'mvr'

def num(v, default=0.0):
    try:
        return float(v)
    except (TypeError, ValueError):
        return default

def load(player):
    cap = player.capitalize()
    base = json.load(open(RAW / f'{player}-match-history.json'))['result']['data'][f'allSheet{cap}MatchHistory']['edges']
    times = json.load(open(RAW / 'detailed-stats_match-winning-goals.json'))['result']['data'][f'allSheet{cap}MatchHistory']['edges']
    assert len(base) == len(times)
    out = []
    for i, (b, t) in enumerate(zip(base, times)):
        m, tm = dict(b['node']), t['node']
        assert m['opponent'] == tm['opponent'] and m['date'] == tm['date']
        d, mon = m['date'].split('-')
        m['iso'] = f"{m['year']}-{mon}-{d}"
        m['goalTimes'] = tm.get('goalTimes')
        for k in ('scoreTeam', 'scoreOpponent', 'goals', 'assists', 'allAssists', 'pens', 'pensMissed', 'minsPlayed', 'started',
                  'freeKicks', 'insideBox', 'outsideBox', 'left', 'right', 'head', 'other', 'hatTricks', 'motm'):
            m[k] = int(num(m.get(k)))
        for k in ('shots', 'shotsOnTarget', 'keyPasses', 'successfulDribbles', 'bigChancesCreated', 'aerialDuels', 'throughballs', 'xg', 'xa', 'rating'):
            v = m.get(k)
            m[k] = None if v in (None, '-', '') else num(v, None)
        out.append(m)
    out.sort(key=lambda m: m['iso'])
    return out
