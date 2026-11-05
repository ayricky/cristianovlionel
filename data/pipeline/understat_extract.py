"""Filter the worldfootballR Understat shot archives down to the two players. Input dir is argv[1]."""
import json, pathlib, sys
import pyreadr
src = pathlib.Path(sys.argv[1])
out = pathlib.Path(__file__).resolve().parents[1] / 'raw' / 'understat' / 'shots.json'
rows = []
for f in ('epl', 'la_liga', 'serie_a', 'ligue_1'):
    df = list(pyreadr.read_r(str(src / f'{f}_shot_data.rds')).values())[0]
    if f == 'epl': print(list(df.columns))
    mask = df['player'].str.contains('Lionel Messi|Cristiano Ronaldo', na=False)
    sub = df[mask]
    print(f, len(df), len(sub), df['date'].min() if 'date' in df else '', df['date'].max() if 'date' in df else '')
    for r in sub.to_dict('records'):
        rows.append({k: (None if v != v else v) for k, v in r.items()})
json.dump(rows, open(out, 'w'), default=str)
print(len(rows))
