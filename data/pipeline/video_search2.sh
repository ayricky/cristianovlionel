#!/bin/bash
cd "$(dirname "$0")/../raw/videos"
while IFS='|' read -r key q; do
  [ -z "$key" ] && continue
  timeout 60 uv run --with yt-dlp yt-dlp --no-warnings --flat-playlist --print "$key	%(id)s	%(channel)s	%(duration)s	%(title)s" "ytsearch12:$q" >> found2.tsv 2>/dev/null
done <<'Q'
ireland2021|Portugal 2-1 Republic of Ireland 2021 Ronaldo two late headers highlights
egypt2018|Portugal 2-1 Egypt 2018 friendly Ronaldo two stoppage time goals highlights
alhilal2023|Al Nassr Al Hilal Arab Club Champions Cup final 2023 Ronaldo two goals highlights
tottenham2009|Manchester United 5-2 Tottenham 2009 Ronaldo comeback highlights
kashima2016|Real Madrid 4-2 Kashima Antlers Club World Cup final 2016 highlights FIFA
villarreal2021|Manchester United 2-1 Villarreal Ronaldo 95th minute winner 2021 highlights
atalanta2021|Manchester United 3-2 Atalanta Ronaldo winner 2021 highlights
tottenham2022|Ronaldo hat-trick Manchester United 3-2 Tottenham 2022 highlights
headers|Cristiano Ronaldo best headers goals official
headersucl|Ronaldo Champions League headers all goals UEFA
freekicks|Cristiano Ronaldo best free kicks official
leftfoot|Cristiano Ronaldo best left foot goals official
perfect2017|Bayern Real Madrid 2017 Ronaldo hat-trick extra time all goals
alkholood2026|Ronaldo hat-trick Al Nassr Al Kholood 5-3 October 2026 highlights
assists|Cristiano Ronaldo best assists official
longrange|Ronaldo best long range goals Premier League official
uclrecord|Cristiano Ronaldo 2013-14 17 goals Champions League record every goal UEFA
overhead|Ronaldo bicycle kick Al Nassr 2025 goal of the season
Q
