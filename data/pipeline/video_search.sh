#!/bin/bash
# Search YouTube for each moment; one TSV per query. Filtering to official channels happens in video_filter.py
cd "$(dirname "$0")/../raw/videos"
while IFS='|' read -r key q; do
  [ -z "$key" ] && continue
  timeout 60 uv run --with yt-dlp yt-dlp --no-warnings --flat-playlist --print "$key	%(id)s	%(channel)s	%(duration)s	%(title)s" "ytsearch15:$q" >> found.tsv 2>/dev/null
done <<'Q'
cl2008|Ronaldo header Champions League final 2008 Manchester United Chelsea UEFA highlights
porto2009|Ronaldo Porto 2009 long range goal Champions League Manchester United official
calma2012|Ronaldo Camp Nou 2012 calma goal Barcelona 1-2 Real Madrid title highlights
wolfsburg2016|Real Madrid 3-0 Wolfsburg Ronaldo hat-trick 2016 UEFA Champions League official highlights
bayern2017|Real Madrid 4-2 Bayern Ronaldo hat-trick 2017 highlights official
atleti2017|Real Madrid 3-0 Atletico Ronaldo hat-trick 2017 semi-final highlights official
bicycle2018|Ronaldo bicycle kick Juventus 2018 Champions League official
pen2018|Real Madrid 1-3 Juventus 2018 Ronaldo 97 minute penalty highlights
atleti2019|Juventus 3-0 Atletico Madrid Ronaldo hat-trick 2019 highlights official
kiev2018|Champions League final 2018 highlights Real Madrid Liverpool
cardiff2017|Juventus 1-4 Real Madrid 2017 final highlights Ronaldo
hungary2016|Hungary 3-3 Portugal Euro 2016 highlights Ronaldo UEFA
wales2016|Ronaldo header Wales Euro 2016 semi-final highlights UEFA
final2016|Portugal 1-0 France Euro 2016 final highlights Eder Ronaldo
spain2018|Portugal 3-3 Spain World Cup 2018 Ronaldo hat-trick FIFA highlights
swiss2019|Portugal 3-1 Switzerland Nations League 2019 Ronaldo hat-trick UEFA highlights
nl2025|Portugal Spain Nations League final 2025 highlights Ronaldo equaliser UEFA
germany2025|Germany 1-2 Portugal Nations League semi-final 2025 highlights Ronaldo
sampdoria2019|Ronaldo header Sampdoria 2019 jump leap Juventus
united2008|Manchester United 2008 Ronaldo every Premier League goal 31 goals official
juve2020|Ronaldo Serie A 2019-20 all goals Juventus official
alnassr2026|Al Nassr Damac 4-1 Ronaldo title 2026 Saudi Pro League highlights
damac2026|Ronaldo brace Al Nassr champions Saudi Pro League 2026 Damac
croatia2026|Portugal Croatia World Cup 2026 highlights Ronaldo penalty
messi2022|Argentina France 2022 World Cup final highlights FIFA
messi2017|Real Madrid 2-3 Barcelona 2017 Messi 500th goal highlights
goal1000|Ronaldo best goals top 10 Champions League UEFA official
top10ucl|UEFA Champions League Cristiano Ronaldo top 10 goals
Q
