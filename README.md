# 985

Interactive case for Cristiano Ronaldo as the most decisive goalscorer of his era. Remove every goal he and Messi scored and watch what disappears.

```
npm install
npm run dev          # local site
npm run build        # type-check and bundle to dist/
npm run data         # rebuild src/data/site.json from data/raw
npm run check:data   # assert 58 headline numbers
```

- `data/raw/mvr`: match logs from messivsronaldo.app, to 1 Nov 2026.
- `data/raw/football-data`: league results, download list in `data/pipeline/leagues.py`. Not committed.
- `data/raw/understat/shots.json`: both players' shots, cut from the worldfootballR Understat archives by `data/pipeline/understat_extract.py`.
- `data/raw/mvr2`: extra stat tables from messivsronaldo.app.
- `data/pipeline`: `load.py` (logs), `leagues.py` (season replay), `ties.py` (knockout replay), `build.py` (core stats), `extras.py` (shot map, comebacks, combinations, opposition), `check.py` (assertions).
- `data/research`: sourced notes on honours, records and published impact studies.
- `src/lib/field.ts`: the WebGL lights. One point per goal. `src/lib/shapes.ts` lays them out, `src/lib/pitch.ts` is the 3D pitch, and `src/components/Story.tsx` pins a chapter and walks its steps.
- `src/lib/videos.ts`: YouTube clips. `embed: false` means the channel blocks off-site playback, so the card links out.

The counting method is on the site's last section.
