# 985

Interactive case for Cristiano Ronaldo as the most decisive goalscorer of his era. Remove every goal he and Messi scored and see what disappears, then filter the data yourself.

```
npm install
npm run dev          # local site
npm run build        # type-check and bundle to dist/
npm run data         # rebuild src/data/site.json from data/raw
npm run check:data   # assert 86 headline numbers
```

- `data/raw/mvr`: match logs from messivsronaldo.app, to 1 Nov 2026.
- `data/raw/football-data`: league results, download list in `data/pipeline/leagues.py`. Not committed.
- `data/raw/understat/shots.json`: both players' shots, cut from the worldfootballR Understat archives by `data/pipeline/understat_extract.py`.
- `data/raw/mvr2`: extra stat tables from messivsronaldo.app.
- `data/pipeline`: `load.py` (logs), `leagues.py` (season replay), `ties.py` (knockout replay), `build.py` (core stats), `extras.py` (shot map, comebacks, combinations, opposition), `check.py` (assertions).
- `data/raw/ballon`: Wikipedia pages for each Ballon d'Or vote.
- `data/raw/wiki`: Wikipedia tournament pages.
- `data/research`: sourced notes on honours, records, the Ballon d'Or and published impact studies.
- `src/lib/field.ts`: the WebGL lights in the opening screen, one point per goal. `src/lib/shapes.ts` lays them out.
- `src/lib/compare.ts`: recomputes both players' numbers in the browser for the Compare filters.
- `src/lib/stats.ts`: the sections of the Every stat tables.
- `src/components/Film.tsx`: YouTube clips, with start and end seconds. Video stays on YouTube and is not in this repo.
- `public/img`: press and wire photos, which belong to their owners. Each one is credited in `src/data/credits.json`.

[Live site](https://cristianovlionel.ayricky.dev), on the Cloudflare Pages project `cristianovlionel`:

```
npm run build && secrets run cristianovlionel/cloudflare-pages -- npx wrangler pages deploy dist --project-name cristianovlionel --branch main
```

Wrangler may offer to migrate the project to Workers and edit `package.json` and `vite.config.ts`. Revert those if it does.

Some video owners block embeds even when YouTube reports them as embeddable, so test a new clip from the live site first.

The counting method is on the site's last section.

## Where this stopped

`main` matches the live site. The `variants` branch rebuilds it as a calm analysis page: live filters, 116 searchable stats, a year-by-year Ballon d'Or table and a 2D shot map. It has not been deployed.

Open items on `variants`:

- Decide whether to deploy it, and whether the opening screen stays full size.
- Test it on a real phone. So far it has only run at phone sizes in headless Chromium.
- `src/variants` and `src/lib/variant.ts` hold the shelved themes, which have not been retested against the new page.
- `Exhibit`, `Versus` and `useScene` in `src/components/Bits.tsx` may now be dead code.
- The `p-lift` photo is from Lisbon 2014, but its caption says Five Champions Leagues.
