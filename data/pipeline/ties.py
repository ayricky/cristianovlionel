"""Group knockout matches into ties and replay each one with a player's goals removed."""
import collections, re
from load import load

KO_ROUNDS = {'F', 'SF', 'QF', 'R16', 'R32', 'R64', 'R96', 'Play-off', '3rd Place Play-off'}

def ties(ms, take=lambda m: m['goals']):
    groups = collections.defaultdict(list)
    for m in ms:
        if m['round'] in KO_ROUNDS and m['round'] != '3rd Place Play-off':
            groups[(m['competition'], m['season'], m['round'], m['opponent'])].append(m)
    out = []
    for (comp, season, rnd, opp), legs in groups.items():
        legs.sort(key=lambda m: m['iso'])
        tf = sum(m['scoreTeam'] for m in legs); ta = sum(m['scoreOpponent'] for m in legs)
        rm = [take(m) for m in legs]
        tf2 = tf - sum(rm)
        two = len(legs) == 2
        away_for = sum(m['scoreTeam'] for m in legs if m['homeAway'] == 'A')
        away_for2 = sum(m['scoreTeam'] - k for m, k in zip(legs, rm) if m['homeAway'] == 'A')
        away_ag = sum(m['scoreOpponent'] for m in legs if m['homeAway'] == 'H')
        pen = legs[-1]['penScore']
        won_sh = None
        if pen:
            a, b = map(int, pen.split('-')); won_sh = a > b
        if tf > ta: won = True
        elif tf < ta: won = False
        elif pen: won = won_sh
        elif two: won = None  # settled on away goals, resolved below
        else: won = None
        if won is None and two:
            won = away_for > away_ag if away_for != away_ag else None
        # replay
        if tf2 > ta: st = 'through'
        elif tf2 < ta: st = 'out'
        else:
            if two and legs[0]['iso'] < '2021-07-01' and comp in ('Champions League', 'Europa League', 'UEFA Cup', 'Champions League Qualifying', 'Copa del Rey', 'Supercopa de Espana'):
                if away_for2 > away_ag: st = 'through'
                elif away_for2 < away_ag: st = 'out'
                else: st = 'level'
            else:
                st = 'level'
        out.append(dict(comp=comp, season=season, round=rnd, opp=opp, legs=len(legs), gf=tf, ga=ta, removed=sum(rm), gf2=tf2, won=won, status=st, pen=pen,
                        iso=legs[-1]['iso'], notes=[m['notes'] for m in legs], scores=[(m['homeAway'], m['scoreTeam'], m['scoreOpponent'], m['goals']) for m in legs]))
    return sorted(out, key=lambda t: t['iso'])
