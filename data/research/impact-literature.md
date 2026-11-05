# Ronaldo vs Messi: published impact literature

Compiled 2026-11-05. Everything under a numbered section was read on the source page. Search-snippet items are in the UNVERIFIED section at the end, and known-bad claims are in DO NOT USE.

## Read this first

The published record does not favour Ronaldo on total impact. The whole-player models that compare the two directly put Messi ahead: Hvattum's plus-minus, VAEP, the Soccer Factor Model, and Ian Graham's Liverpool models. One exception is Kharrat's plus-minus, where neither leads and each makes the annual top three twice. I found no published model that ranks Ronaldo above Messi on total contribution across a career.

Ronaldo's strongest ground is narrower and real. He leads on Champions League knockout goals, goals after 30, availability, international goals, heading and weak-foot balance, and the size of the drop at Real Madrid after he left. In most goals-only comparisons of importance the two are close, and Ronaldo often leads the total while Messi leads per goal.

Three facts changed recently, and older pieces will be stale:

- Ronaldo retired from international football today, 5 November 2026, with 146 goals in 234 caps ([Sky Sports](https://www.skysports.com/football/news/13593800/cristiano-ronaldo-retires-from-international-football-after-glittering-portugal-career-that-spanned-23-years), [ESPN](https://www.espn.com/soccer/story/_/id/50387887/cristiano-ronaldo-portugal-career-best-moments-key-stats-retirement-international-soccer)). A search summary said he had not retired, because it was built on October reports of the row with coach Jorge Jesus.
- Messi retired from Argentina after the 2026 World Cup final, which Argentina lost 1-0 to Spain on 19 July ([ESPN](https://www.espn.com/soccer/story/_/id/49784066/lionel-messi-argentina-career-stats-records-how-compares-cristiano-ronaldo)).
- Ronaldo's 985 career goals include one goal that Opta ruled an own goal and the Saudi Pro League credited to him ([ESPN, 2 Nov 2026](https://espn.com/espn/story/_/id/50357130/messi-ronaldo-latest-updates-goat-lionel-messi-winner-937-cristiano-ronaldo-ballon-dor-all-phantom-goal-hattrick-15-away-1000)). Footnote that goal, or expect someone to raise it.

## How I checked

I re-downloaded 58 pages and searched the raw text for each number or quote. 57 matched exactly. The UEFA page timed out on that pass, so its figures rest on an earlier successful fetch. Papers were read as PDF text with pdftotext, and the Wikipedia league tables through the page-reading tool.

Source tiers:

- A: paper or preprint.
- B: established publisher or data company.
- C: fan stats site, aggregator or blog. The number is on the page, but nobody independent has audited it.

"Derived" means I did the arithmetic on published figures. "Plot reading" means the value appears only in a chart, and I read it off by eye.

Sites I could not read are listed under Gaps.

---

## 1. Impact on team results

### 1.1 Economist expected points added, 2013 and 2014

- Claim: Ronaldo's edge in raw goals nearly vanishes once each goal is weighted by how much it changed expected points. Messi pulls ahead when match importance is also weighted.
- Numbers: Unweighted EPA: Ronaldo 41.6 from 105 goals, 0.40 per goal. Messi 40.3 from 86 goals, 0.47 per goal. Match-weighted, including the World Cup: Messi 59.5, Ronaldo 50.4, which is 0.69 vs 0.48 per goal.
- Method: EPA is expected points after a goal minus expected points before it, using a win-probability model built on about 4,000 Premier League matches. The second version multiplies by match importance.
- Favours: Messi, per goal and once match-weighted. Ronaldo on the unweighted total, narrowly.
- Tier: B, second-hand. The original was unreachable. NBC reproduces the 41.6 and 40.3 passage verbatim. Holding Midfield has 59.5 and 50.4. Zuo (1.2) has 0.69 and 0.48. Those per-goal figures multiply back to 59.3 and 50.4, so the two sets of numbers are different versions of the same study, not a conflict.
- Note: The Economist shows why Ronaldo's total is flattered. His goal in the 2014 Champions League final, a penalty in extra time at 3-1 up, was worth 0.004 EPA. In the window Ronaldo scored 19 penalties from 22 and Messi 11 from 13.
- Source: https://www.nbcsports.com/soccer/news/when-it-comes-to-goals-messi-lords-over-ronaldo-so-says-the-economist and https://www.holdingmidfield.com/ronaldo-vs-messi-how-do-the-titans-of-football-compare/ (original URL as cited there: http://www.economist.com/blogs/gametheory/2015/03/statistical-analysis-football)
- Date: The Economist, March 2015. NBC, 25 March 2015. Holding Midfield, 23 July 2021.

### 1.2 Sensitivity test of the Economist result

- Claim: A self-described Ronaldo fan tried to break the Economist finding. It held per goal, but Ronaldo leads the total once World Cup games are removed.
- Numbers: Shifting win, draw and loss probabilities by plus or minus 10%: Ronaldo 0.47 to 0.49, Messi 0.68 to 0.70. Excluding the World Cup: Ronaldo 43.6, Messi 39.7, averages 0.41 and 0.47. Messi also missed 14 league matches injured in that season.
- Method: Re-ran match-weighted EPA under six probability scenarios, then dropped the World Cup games, which carry match weights of 2 to 7.
- Favours: Messi per goal. Ronaldo on the total without the World Cup.
- Tier: C, a personal blog with a transparent method.
- Source: http://chandlerzuo.github.io/blog/2015/06/soccer
- Date: 25 June 2015.

### 1.3 Expected points added, 2009-10 to April 2012

- Claim: In Spain, Ronaldo's goals carried marginally more total expected points on a near-identical tally. The author calls the gap not statistically significant.
- Numbers: Messi 106 goals, Ronaldo 107 since 2009-10. Both scored 35 goals that gave their team the lead. Barcelona and Real Madrid both averaged about 0.52 EPA per goal. Each player produced over 40% of his team's goals and total EPA in 2011-12.
- Method: Soccer Statistically's outcome probability calculator, league goals, three seasons.
- Favours: Neutral, with a tiny Ronaldo lean.
- Tier: C, an analytics blog. The page does not name the author. A commenter's "Omar" and a sidebar link to @OmarChaudhuri suggest Omar Chaudhuri.
- Source: https://5addedminutes.com/2012/04/16/messi-vs-ronaldo-a-goal-scoring-comparison/
- Date: 16 April 2012.

### 1.4 Added Goal Value, win-probability model

- Claim: Across Europe's top five leagues in 2017-18 and 2018-19, Messi ranks among the top three in expected league points added per 90 by his goals. Ronaldo adds more per goal.
- Numbers: The paper names Alcacer, Messi and Mbappe as the top three. Plot reading: Messi about 0.99 goals per 90 and 0.45 AGV. Ronaldo about 0.75 goals per 90 and 0.40 AGV. Derived from those readings: about 0.45 AGV per goal for Messi and about 0.54 for Ronaldo. Ronaldo sits above the paper's trend line and Messi below it.
- Method: Sum of 3 times the change in win probability plus the change in draw probability for each goal, per 90 minutes. Pre-game team strength is removed.
- Favours: Messi on rate per 90. Ronaldo per goal. The per-goal figures are my estimates from a chart, so quote them as approximate or ask the authors for the data.
- Tier: A. Robberechts, Van Haaren, Davis, KDD 2021.
- Source: https://arxiv.org/pdf/1906.05029 (Figure 6, page 7)
- Date: June 2019 (arXiv), KDD August 2021.

### 1.5 Points won via goals, career

- Claim: Ronaldo's goals changed more points in total. Messi's goals plus assists changed more.
- Numbers: Points won via goals: Ronaldo 418 (18.09% of his 2,311 points won), Messi 364 (18.55% of 1,962). Via goals plus assists: Messi 578 (29.46%), Ronaldo 553 (23.93%). Points contested: Ronaldo 3,087, Messi 2,595. Points won rate: Messi 75.61%, Ronaldo 74.86%.
- Method: Compares each actual result with the result had he not scored, counting league and group games only, at 3 points for a win and 1 for a draw. Runs 2002-03 to 2026-27 so far.
- Favours: Ronaldo on goal volume, level on share, Messi once assists count.
- Tier: C. Useful as a check against your own counterfactuals, since the method is close to yours.
- Source: https://www.messivsronaldo.app/detailed-stats/points-contribution/
- Date: Live page, read 5 November 2026.

### 1.6 Match-winning goals, club career

- Claim: Ronaldo has more club match-winners, at the same rate per game.
- Numbers: Ronaldo 207 in 886 games. Messi 179 in 768 games. Derived: 0.234 and 0.233 per game.
- Method: Not defined. The figures come from a Twitter account that the article says it corroborated on Transfermarkt.
- Favours: Ronaldo on total, level per game.
- Tier: C. The scope wording differs ("for Barcelona" vs "in the club game"), and the data stops at March 2021.
- Source: https://www.givemesport.com/1666121-cristiano-ronaldo-vs-lionel-messi-who-has-scored-the-most-matchwinning-goals/
- Date: 27 March 2021.

### 1.7 Offensive and defensive plus-minus

- Claim: Messi has the highest overall rating of 10,369 players. Ronaldo is third on offence and 26th overall.
- Numbers: Messi: offensive 0.382, defensive 0.015, total 0.397, rank 1, 31,132 minutes. Ronaldo: offensive 0.341, defensive -0.015, total 0.325, rank 26 overall, 34,880 minutes. Luis Suarez leads offence at 0.387.
- Method: Regularised plus-minus on the data set from August 2008 to July 2017, with an age curve. The ratings are as of July 2017, so age lowers Ronaldo's rating at 32. The author says so.
- Favours: Messi. The age adjustment explains part of the gap, since Messi was two years younger at the cut-off.
- Tier: A. Hvattum, Applied Sciences 10(20), 7345.
- Source: https://doi.org/10.3390/app10207345 (PDF: https://pdfs.semanticscholar.org/7bba/436d26cc68b8250692132851c8c0e848fc75.pdf)
- Date: 2020.

### 1.8 Plus-minus ratings for soccer

- Claim: Across 11 European leagues, neither player tops a calendar year. Each appears twice in the annual top three.
- Numbers: Ronaldo second in 2011 (0.914) and 2013 (0.904). Messi third in 2012 (0.847) and 2014 (0.869). Messi tops the expected-goals plus-minus ranking. Kante tops the goals and expected-points versions.
- Method: Mean of three plus-minus ratings normalised to 0 to 1, minimum 900 minutes, 2009-10 to 2016-17.
- Favours: Mixed.
- Tier: A. Kharrat, Pena, McHale.
- Source: https://arxiv.org/pdf/1706.04943 (Table 5)
- Date: June 2017 (arXiv).

### 1.9 VAEP action values, 2017-18

- Claim: Messi rates clearly above every player in Spain and England. Ronaldo is in the Spanish top 10, as a striker with few, highly valued actions.
- Numbers: The paper shows the gap only in plots. It says Messi is "clearly in a class of his own" and describes him as an outlier on action quality and quantity together. A snippet gives 1.21 vs 0.61 per game. I could not confirm that pair, so it is in UNVERIFIED.
- Method: Values every on-ball action by its change in the probability of scoring and conceding.
- Favours: Messi.
- Tier: A. Decroos, Bransen, Van Haaren, Davis, KDD 2019.
- Source: https://arxiv.org/pdf/1802.07127
- Date: February 2018 (arXiv).

### 1.10 Ian Graham, Liverpool's outgoing research director

- Claim: On models of broader contribution to team success, Graham says Messi is clearly superior. No model output was published.
- Quote: "It's Messi." "The chances he creates for his teammates are an order of magnitude greater than Ronaldo. Messi does two jobs brilliantly. Ronaldo does one job brilliantly."
- Method: Proprietary club models, described at the Cheltenham Science Festival.
- Favours: Messi.
- Tier: B. The Guardian, read through Yahoo syndication.
- Source: https://uk.sports.yahoo.com/news/messi-beats-ronaldo-goat-status-150034672.html
- Date: 8 June 2023.

### 1.11 CIES weighted goal contributions, last 365 days

- Claim: Messi ranks first in the world on weighted goal contributions. Ronaldo is in the top 100.
- Numbers: Messi 59 raw (37 goals, 22 assists), 66.3 weighted, rank 1. Ronaldo 31 raw. The weighted score is not on the page I read.
- Method: Goals and assists multiplied by a ratio of match strength coefficients, league matches across 67 leagues, Impect data.
- Favours: Messi. Recent form only.
- Tier: B.
- Source: https://www.cies.ch/cies/news/news-detail/article/most-decisive-players-messi-in-world-form
- Date: 4 March 2026.

### 1.12 Share of team output

- Claim: At their peaks, each carried the same share of his team's attack.
- Number: "about one-third of their team's shots, expected goals, and non-penalty goals".
- Method: Caley's event data.
- Favours: Neutral.
- Tier: B. Expecting Goals, Part I.
- Source: https://www.expectinggoals.com/p/messi-ronaldo-who-is-the-greatest-statistics-analytics
- Date: 9 July 2026.

---

## 2. Difficulty-adjusted scoring and big games

### 2.1 Champions League knockout goals

- Claim: Ronaldo holds the Champions League knockout record, and the gap is widest in the late rounds.
- Numbers: Knockout goals: Ronaldo 67 in 85, Messi 49 in 77. By round, goals in appearances, Ronaldo then Messi: last 16, 25 in 36 and 29 in 36. Quarter-finals, 25 in 22 and 12 in 23. Semi-finals, 13 in 21 and 6 in 15. Finals, 4 in 6 and 2 in 3. Derived for quarter-finals onward: Ronaldo 42 in 49, 0.86 per game. Messi 20 in 41, 0.49 per game. Group stage: Messi 80 in 86, Ronaldo 73 in 98. Career: Ronaldo 140 in 183, Messi 129.
- Method: Goal counts, qualifiers excluded. No adjustment for opponent or score state.
- Favours: Ronaldo. Messi leads the last 16 and the group stage. Section 1.1 shows that some of Ronaldo's late-round goals were pile-ons.
- Tier: B for the 140 and 67, and "Only player to score in three Champions League finals". C for the round splits, which do sum to 67 and 49.
- Source: https://www.uefa.com/uefachampionsleague/news/02a7-2136b8f054ea-76a61b3f9d24-1000--cristiano-ronaldo-in-the-champions-league-records-stats-wh/ and https://www.messivsronaldo.app/club-stats/champions-league/
- Date: UEFA updated 28 July 2026. Fan site read 5 November 2026.

### 2.2 World Cup knockout matches

- Claim: Messi has far outperformed Ronaldo in World Cup knockout games.
- Numbers: Ronaldo 1 goal, 0 assists in 9 games. Messi 7 goals, 10 assists in 17 games. Neither had scored in a World Cup knockout game before Qatar 2022.
- Method: Counts.
- Favours: Messi.
- Tier: B.
- Source: https://www.espn.com/soccer/story/_/id/49784066/lionel-messi-argentina-career-stats-records-how-compares-cristiano-ronaldo and https://theanalyst.com/articles/messi-vs-ronaldo-world-cup
- Date: ESPN, 31 August 2026. The Analyst, 15 November 2022.

### 2.3 Messi at the 2026 World Cup

- Claim: Messi carried Argentina to the final at 39.
- Numbers: 8 goals and 4 assists, 12 of Argentina's 19 goals (63%) before the final. 21 career World Cup goals. Over eight knockout matches in 2022 and 2026, 7 goals and 6 assists. Argentina then lost the final 1-0 after extra time.
- Method: Opta counts.
- Favours: Messi.
- Tier: B.
- Source: https://theanalyst.com/articles/lionel-messi-greatest-player-of-all-time-debate-settled-world-cup-2026
- Date: 18 July 2026.

### 2.4 League goals against top sides

- Claim: Messi scores more, and more often, against the best league opposition. The gap closes as the opposition gets weaker.
- Numbers: Goals in games, minutes per goal. Versus top 3: Messi 42 in 64, 129. Ronaldo 30 in 72, 189. Versus top 6: Messi 121 in 161, 110. Ronaldo 119 in 178, 119. Versus top 10: Messi 224 in 283, 104. Ronaldo 225 in 323, 116.
- Method: League games, split by opponent's table position. The page does not define the ranking date.
- Favours: Messi.
- Tier: C.
- Source: https://www.messivsronaldo.app/all-time-stats/vs-top-sides/
- Date: Live page, read 5 November 2026.

### 2.5 El Clasico, the shared nine-season window

- Claim: In La Liga Clasicos while both played, Messi out-produced Ronaldo.
- Numbers: Messi 12 goals (9 away, 3 home), 4 of them penalties in the away set. Ronaldo 9 goals (6 away, 3 home, the home three all penalties). Assists: Messi 6, Ronaldo 1. Barcelona 10 wins, Madrid 4, 4 draws, 39-23 on aggregate. Each started 17 games.
- Method: Opta counts, La Liga only.
- Favours: Messi.
- Tier: B. Stats Perform via FotMob. Undated page.
- Source: https://www.fotmob.com/en-GB/news/30h74a7wz7ze1jb4niqo0f98c/el-clasico-messi-and-ronaldo-have-gone-but-which-superstar-shone-brightest-in-barca-v-real-madrid-showdowns
- Date: Not stated. Written after both had left La Liga.

### 2.6 International goals against ranked teams

- Claim: Ronaldo leads narrowly against top-10 sides, and Messi leads against top-20 and top-30 sides.
- Numbers: Versus FIFA top 10: Ronaldo 18, Messi 17. Top 20: Messi 32, Ronaldo 30. Top 30: Messi 49, Ronaldo 46.
- Method: Counts by FIFA ranking.
- Favours: Split. ESPN's lead-in says Ronaldo has scored more against higher-placed teams, but only the top-10 line supports that. Don't reuse the sentence.
- Tier: B.
- Source: https://www.espn.com/soccer/story/_/id/49784066/lionel-messi-argentina-career-stats-records-how-compares-cristiano-ronaldo
- Date: 31 August 2026.

### 2.7 Finishing against expected goals, Understat

- Claim: Messi beat his expected goals by far more than Ronaldo did.
- Numbers: League, 2014-15 to 2022-23: Messi 253 goals from 219.91 xG, +33.1. Ronaldo 234 goals from 229.38 xG, +4.6. I re-summed the season rows and both totals match. Rob Fielder reports the same 234 from 229.5, and 126 from 123.4 on FBref for 2017 to 2023.
- Method: Understat's model, league only. Figures include penalties.
- Favours: Messi. Understat gives no post-shot or goalkeeper adjustment.
- Tier: C for the site, B-level consistency from the independent match on Ronaldo.
- Source: https://www.messivsronaldo.app/detailed-stats/xg-expected-goals/ and https://robfielder.substack.com/p/the-lucky-shot-the-importance-of
- Date: Live page, read 5 November 2026. Fielder, 19 August 2026.

### 2.8 Finishing, analyst verdict and penalties

- Claim: Caley rates Messi among the best finishers of the era and Ronaldo as above average but not elite. Ronaldo is the better penalty taker.
- Numbers: Penalty conversion: Ronaldo 85%, Messi 79%, global average 77%. Ronaldo scored 34 more penalties, more than the 639 to 625 lead he holds in domestic and Champions League goals since 2000. Shots since 2009-10: about 3,300 for Ronaldo, about 2,850 for Messi. Caley's sample, 2010-11 to 2023, players with 750 or more shots: Messi 449 from 352 xG, 27% above, as reported by Fielder.
- Method: Caley's xG data.
- Favours: Messi on open-play finishing. Ronaldo on penalties.
- Tier: B.
- Source: https://www.expectinggoals.com/p/messi-ronaldo-who-is-the-greatest-statistics-analytics and https://robfielder.substack.com/p/the-lucky-shot-the-importance-of
- Date: 9 July 2026 and 19 August 2026.

### 2.9 Academic work on Messi's finishing

- Claim: Standard xG models understate Messi because his own shots train them.
- Numbers: The bias understates his goals above expected by 17%. His figure is 27% higher than the typical elite high-volume attacker. In a separate paper, 415 La Liga goals from 342 xG, 21.34% above.
- Method: Multi-calibration on StatsBomb's Messi data, and a player-adjusted xG model.
- Favours: Messi. Ronaldo is not assessed, because La Liga data dominates these samples.
- Tier: A. Davis and Robberechts. Hewitt and Karakus.
- Source: https://arxiv.org/pdf/2401.09940 and https://arxiv.org/pdf/2301.13052
- Date: January 2024 and January 2023 (arXiv).

---

## 3. Team effects of moves and absences

These are small samples with heavy confounding. Managers, squads and opposition all change, and absences skew towards rested players against weak sides. The with/without splits below are descriptive, not causal.

### 3.1 Manchester United after 2009

- Numbers: 2008-09: champions, 90 points, 68 scored, 24 conceded. 2009-10: second, 85 points, 86 scored, 28 conceded, one point behind Chelsea.
- Method: League tables.
- Favours: Mixed. Five fewer points and the title lost by one point, but 18 more goals.
- Tier: B.
- Source: https://en.wikipedia.org/wiki/2008%E2%80%9309_Premier_League and https://en.wikipedia.org/wiki/2009%E2%80%9310_Premier_League

### 3.2 Real Madrid after 2018

- Numbers: La Liga 2017-18: third, 76 points, 94 scored, 44 conceded. 2018-19: third, 68 points, 63 scored, 46 conceded. All competitions: 148 goals in 2017-18, 108 in 2018-19, 99 in 2019-20. 2019-20: league champions, 87 points, 70 scored, 25 conceded.
- Method: League tables, plus The18's all-competition counts, which report a 27% drop.
- Favours: Ronaldo in the first year, with 31 fewer league goals and 8 fewer points. The two-year picture is less clean, since Madrid won the league in 2019-20 with a far better defence and 24 fewer goals than 2017-18.
- Tier: B for the tables. C for The18.
- Source: https://en.wikipedia.org/wiki/2017%E2%80%9318_La_Liga, https://en.wikipedia.org/wiki/2018%E2%80%9319_La_Liga, https://en.wikipedia.org/wiki/2019%E2%80%9320_La_Liga and https://the18.com/en/soccer-entertainment/real-madrid-without-ronaldo-stats
- Date: The18, 1 September 2020.

### 3.3 Real Madrid in games Ronaldo missed

- Numbers: La Liga win rate 76.1% with him, 76.5% without. Points per game 2.4 both ways. Goals per game 2.9 with, 2.4 without. All competitions win rate 72.9% with, 72.4% without.
- Method: Results split by whether he played. The article gives no sample sizes, and he was often rested against weaker opposition.
- Favours: Against Ronaldo, and it cuts against section 3.2. If you use 3.2, expect this to be quoted back.
- Tier: B.
- Source: https://www.goal.com/en/news/ronaldo-one-year-closer-to-retiring---what-is-madrids-record-with-and-without-cr7/14cuvuf4855jw13p1cf9t0kloo
- Date: 5 February 2017.

### 3.4 Juventus with and after Ronaldo

- Numbers: Serie A, before him: 2017-18, champions, 95 points, 86 scored, 24 conceded. With him: 2018-19, champions, 90, 70, 30. 2019-20, champions, 83, 76, 43. 2020-21, fourth, 78, 77, 38. After him: 2021-22, fourth, 70, 57, 37. Goals per game per Tuttosport's editor: 2.0 in the Ronaldo period, then 1.5, 1.4 and 1.2 in the seasons after. Ronaldo: 101 goals in 133 appearances. After he left in 2021, Juventus took one point from their next three league games.
- Method: League tables and a columnist's averages. The JuveFC summary does not label the seasons.
- Favours: Mixed. Points fell every year he was there, while scoring collapsed after he left. He does not read as a clear team upgrade, but he does read as covering a declining side.
- Tier: B for the tables and ESPN. C for JuveFC summarising Tuttosport.
- Source: https://en.wikipedia.org/wiki/2017%E2%80%9318_Serie_A, https://en.wikipedia.org/wiki/2018%E2%80%9319_Serie_A, https://en.wikipedia.org/wiki/2019%E2%80%9320_Serie_A, https://en.wikipedia.org/wiki/2020%E2%80%9321_Serie_A, https://en.wikipedia.org/wiki/2021%E2%80%9322_Serie_A, https://www.juvefc.com/how-much-juventus-attacking-stats-plummeted-since-cristiano-ronaldos-departure/ and https://www.espn.com/soccer/story/_/id/37621845/giorgio-chiellini-cristiano-ronaldos-late-juventus-departure-affected-team
- Date: JuveFC, 24 April 2025. ESPN, 22 October 2021.

### 3.5 Barcelona after 2021

- Numbers: 2020-21: third, 79 points, 85 scored, 38 conceded. 2021-22: second, 73 points, 68 scored, 38 conceded. 2022-23: champions, 88 points, 70 scored, 20 conceded. League table from Messi's exit to 26 March 2025: Real Madrid 319 points, Barcelona 306.
- Method: League tables.
- Favours: Ronaldo, narrowly, on the like-for-like with 3.2. Barcelona lost 17 league goals and 6 points, against Madrid's 31 and 8. Madrid lost more goals than Ronaldo had scored in the league the year before (26), while Barcelona lost fewer than Messi had (30), per the Understat table in 2.7. Both clubs won the league within two years. Barcelona's finances and squad changed at the same time.
- Tier: B.
- Source: https://en.wikipedia.org/wiki/2020%E2%80%9321_La_Liga, https://en.wikipedia.org/wiki/2021%E2%80%9322_La_Liga, https://en.wikipedia.org/wiki/2022%E2%80%9323_La_Liga and https://www.planetfootball.com/barcelona/la-liga-table-since-lionel-messi-left-barcelona
- Date: Planet Football, 26 March 2025.

### 3.6 Barcelona in games Messi missed

- Numbers: Since the start of 2017-18: with Messi, 129 games, 68.2% wins, 2.1 points per game, 0.8 conceded per game. Without, 26 games, 57.7% wins, 1.7 points per game, 1.2 conceded per game. Goals per game were nearly level, 2.3 and 2.2.
- Method: Results split by whether he played.
- Favours: Messi. It is the clearest with/without gap, though only for his late-career Barcelona years. Compare with 3.3, which covers Ronaldo's Madrid peak.
- Tier: C.
- Source: https://www.planetfootball.com/quick-reads/comparing-barcelonas-record-with-and-without-lionel-messi-since-2017-18
- Date: 9 February 2020.

### 3.7 Argentina with and without Messi

- Numbers: Debut to 19 June 2023: Messi's games, 175, 108 wins, 40 draws, 27 losses, 69.3% of points. Without him, 60 games, 35 wins, 13 draws, 12 losses, 65.5% of points. 45 of the 60 were friendlies. Qualifying for 2018: with Messi 5 wins and 1 loss in 6, without him 1 win, 4 draws, 2 losses in 7. At the 2026 World Cup, Argentina beat Jordan 3-1 with Messi on the bench at kick-off.
- Method: Results split by whether he played.
- Favours: Messi in competitive qualifying, marginal overall.
- Tier: B for Perfil and ESPN. C for FotMob, which is undated, though its context points to March 2017.
- Source: https://442.perfil.com/noticias/seleccion-argentina/argentina-sin-messi-todas-sus-ausencias-en-la-seleccion.phtml, https://www.fotmob.com/news/nhui9evrcbz01fn61qjy8pyo6/with-and-without-messi-the-stats-that-prove-argentina-will-struggle-to-reach-world-cup and https://www.espn.com/football/story/_/id/49204487/argentina-show-win-messi-even-bench-makes-impact
- Date: Perfil, 19 June 2023. ESPN, 28 June 2026.

### 3.8 Portugal with and without Ronaldo

- Numbers: Since the 2022 World Cup: with him, 37 games, 70.2% wins, 2.05 goals per game, 0.63 conceded. Without, 12 games, 75% wins, 3.41 goals per game, 1.08 conceded. Since 2017: with him, 98 games, 63% wins, 2.1 goals per game. Without, 28 games, 64% wins, 2.7 goals per game.
- Method: Results split by whether he played. A 9-0 win over Luxembourg distorts the small sample, and he usually sat out weaker games.
- Favours: Against Ronaldo, weakly. I found no published long-run with/without figure I would trust. See DO NOT USE.
- Tier: B for Planet Football. C for The Sun via Goal via Yardbarker.
- Source: https://www.planetfootball.com/stats-tables/comparing-portugal-record-with-without-cristiano-ronaldo-2022-world-cup and https://www.yardbarker.com/soccer/articles/a_crisis_that_began_10_years_ago_how_did_portugal_become_better_without_ronaldo/s1_17790_44378507
- Date: 5 November 2026 and 2 October 2026.

### 3.9 Euro 2016 final

- Numbers: Ronaldo went off injured after 25 minutes. Eder scored in the 109th minute. Portugal won 1-0 after extra time.
- Method: Match record.
- Favours: Neutral. Portugal won their one major title without him on the pitch. His contribution from the touchline rests on team-mates' testimony, in section 5.
- Tier: B.
- Source: https://www.espn.com/soccer/story/_/id/50387887/cristiano-ronaldo-portugal-career-best-moments-key-stats-retirement-international-soccer
- Date: 5 November 2026.

### 3.10 Major international trophies

- Numbers: Messi: 2021 Copa America, 2022 World Cup, 2024 Copa America, plus the 2022 Finalissima. Ronaldo: Euro 2016, plus Nations League titles in 2019 and 2025. Ronaldo scored in the 2025 Nations League final.
- Favours: Messi.
- Tier: B.
- Source: https://www.espn.com/soccer/story/_/id/49784066/lionel-messi-argentina-career-stats-records-how-compares-cristiano-ronaldo and https://www.skysports.com/football/news/13593800/cristiano-ronaldo-retires-from-international-football-after-glittering-portugal-career-that-spanned-23-years
- Date: 31 August 2026 and 5 November 2026.

---

## 4. Physical measures, completeness and longevity

### 4.1 The Sampdoria header

- Claim: Ronaldo met the ball at 2.56m after a 71cm jump.
- Numbers: 2.56m and 71cm. "Ronaldo reached an impressive height of 2.56m" is Juventus's own line.
- Method: Published by Juventus without explaining the measurement. Match on 18 December 2019.
- Favours: Ronaldo. A club source, but the figures are physically plausible.
- Tier: B.
- Source: https://www.juventus.com/en/news/articles/statofthegame-cr7-at-2-56m
- Date: 19 December 2019.

### 4.2 Lab and documentary jump tests

- Numbers: 58cm vertical jump in 2006 at the Faculdade de Motricidade Humana lab in Lisbon, against a 36cm average for other athletes tested. In 2011, for Tested to the Limit: 44cm hands on hips, 78cm with a step and arm swing, almost 5g at push-off. The Euro 2016 header against Wales: 76.2cm off the ground, head at 2.61m, no measurer named.
- Method: Lab testing in 2006. A Castrol-sponsored documentary in 2011.
- Favours: Ronaldo. Lead with the 2006 lab figure, since it is the only one with a named lab. The 78cm is a sponsor test with a run-in, so it should not be compared with a standing vertical.
- Tier: B.
- Source: https://www.dn.pt/desporto/euro-2016/rapido-forte-e-mais-alto-os-segredos-do-salto-de-cr7-5272350.html and http://www.the42.ie/cristiano-ronaldo-jumping-technique-science-2866732-Jul2016/
- Date: 7 July 2016 (both).

### 4.3 Top sprint speed

- Numbers: Ronaldo 33.60 km/h, Messi 32.50 km/h.
- Method: A 2017 study by the Mexican club Pachuca, reported by AS and The Mirror. Single source, with tracking method unknown.
- Favours: Ronaldo, modestly. This is the best sourced pair I found. No FIFA or UEFA release surfaced.
- Tier: B for the reporter, weak for the underlying study.
- Source: https://aleagues.com.au/news/hyundai-a-league-player-faster-cristiano-ronaldo-and-lionel-messi/
- Date: 14 December 2018, on a February 2017 study.

### 4.4 Goal types and completeness

- Numbers: Opta at Ronaldo's 900th goal: 573 right foot, 173 left foot, 152 headers, 164 penalties, 64 direct free kicks. Current fan-site totals: Ronaldo 634 right, 188 left, 160 headers, 65 free kicks. Messi 788 left, 113 right, 32 headers, 76 free kicks. Derived weak-foot share: Ronaldo 19.1%, Messi 12.1%. Paper, to about 2022: 17.28% of Ronaldo's goals were headers, against 3.71% of Messi's.
- Method: Goal-type counts.
- Favours: Ronaldo on range. Messi leads free kicks.
- Tier: B for Opta via FotMob. C for current totals. A for the paper.
- Source: https://www.fotmob.com/fi/news/1uhk2x9tx9zob1mbffnqk641kt-cristiano-ronaldo-scores-900th-goal-stats-behind-portugal-greats-latest-landmark, https://www.messivsronaldo.app/ and https://arxiv.org/pdf/2603.27502
- Date: FotMob undated, written in September 2024. Fan site read 5 November 2026. Paper, 29 March 2026.

### 4.5 Goals by age

- Numbers: After turning 30: Ronaldo 522, Messi 372. From 35: Ronaldo 263, Messi 168. From 40: Ronaldo 62, while Messi is 39. Ages 35 to 38 only (derived): Ronaldo 151, Messi 147. Through age 39 (derived): Ronaldo 460, Messi 372, with Messi's age-39 year still running. In December 2024 Ronaldo ranked first all-time for goals after 30 with 453, ahead of Romario's 441.
- Method: Opta data on an independent stats site.
- Favours: Ronaldo on totals. The age 35 to 38 gap is only 4 goals, and many of Ronaldo's later goals came in the Saudi league, so the longevity edge is bigger on totals than on like-for-like output.
- Tier: B-level data on a C site. Planet Football is B.
- Source: https://michelacosta.com/messi-vs-ronaldo/goals/-/after-turning-30/by-age/ and https://www.planetfootball.com/stats-tables/players-football-history-most-goals-after-turning-30-messi-ronaldo
- Date: Updated 1 November 2026. Planet Football, 9 December 2024.

### 4.6 Rate after 30

- Numbers: Since turning 30, to February 2026: Ronaldo 501 goals, 107 penalties, one non-penalty goal every 128 minutes, in 592 appearances (derived from "155 fewer games"). Messi 331 goals, one every 126 minutes, in 437 appearances, with 176 assists to Ronaldo's 105.
- Method: Counts and minutes per goal.
- Favours: Ronaldo on volume. Level or slight Messi on rate.
- Tier: B.
- Source: https://onefootball.com/en/news/comparing-cristiano-ronaldos-stats-since-turning-30-with-lionel-messis-as-cr7-hits-landmark-figure-42454245
- Date: 23 February 2026.

### 4.7 Age records at the 2026 World Cup

- Numbers: First player to score at six World Cups. Second-oldest men's World Cup scorer at 41 years, 138 days. Oldest European scorer at a major tournament. Scored at 11 major tournaments, five more than any other European.
- Method: Opta records.
- Favours: Ronaldo.
- Tier: B.
- Source: https://theanalyst.com/articles/cristiano-ronaldo-world-cup-record-goals-sixth-portugal
- Date: 23 June 2026.

### 4.8 Injuries and availability

- Numbers: Messi 53 injuries, 915 days, 196 matches missed. Ronaldo 29 injuries, 482 days, 85 matches missed, 5.76% of his career. Longest layoffs: Messi 88 days and 28 games in 2006-07. Ronaldo 71 days and 8 games in 2008-09.
- Method: Transfermarkt injury records.
- Favours: Ronaldo. Two secondary reports agree. I could not read Transfermarkt directly.
- Tier: B for the data, C for the reporters.
- Source: https://worldsoccertalk.com/news/lionel-messi-vs-cristiano-ronaldo-whos-missed-more-time-with-injuries-in-their-career/ and https://khelnow.com/football/world-football-cristiano-ronaldo-vs-lionel-messi-who-has-spent-most-time-sideline-with-injuries-202508
- Date: 17 and 18 August 2025.

### 4.9 Career totals

- Numbers: Goals: Ronaldo 985, Messi 937. Assists: Messi 428, Ronaldo 261. Hat-tricks: Ronaldo 67, Messi 62. Appearances: Ronaldo 1,343, Messi 1,184. Minutes: Ronaldo 109,812, Messi 97,411. Minutes per goal: Messi 104.0, Ronaldo 111.5. Non-penalty goals (derived, the site lists penalties): Messi 822, Ronaldo 801. Transfermarkt via Marca has different assists, Messi 419 and Ronaldo 269.
- Method: Counts. Assist definitions vary by source.
- Favours: Ronaldo on goals, appearances and minutes. Messi on rate, assists and non-penalty goals.
- Tier: B for ESPN. C for the fan site.
- Source: https://espn.com/espn/story/_/id/50357130/messi-ronaldo-latest-updates-goat-lionel-messi-winner-937-cristiano-ronaldo-ballon-dor-all-phantom-goal-hattrick-15-away-1000, https://www.messivsronaldo.app/ and https://www.beinsports.com/en-us/soccer/articles/messi-vs-cristiano-ronaldo-who-wins-the-goals-and-assists-battle-2026-10-30
- Date: 2 November 2026 and 30 October 2026.

### 4.10 International totals

- Numbers: Ronaldo 146 goals in 234 caps, 62.4%. Messi 126 in 208, per ESPN today. ESPN's August article had Messi on 125 in 207 and said 25 of those were penalties, two more than Ronaldo. Derived non-penalty goals on the August figures: Ronaldo 123, Messi 100. Ronaldo has 10 international hat-tricks.
- Method: Counts.
- Favours: Ronaldo. Note that the two ESPN pieces differ by one goal and one cap for Messi. Check against your own logs.
- Tier: B.
- Source: https://www.espn.com/soccer/story/_/id/50387887/cristiano-ronaldo-portugal-career-best-moments-key-stats-retirement-international-soccer and https://www.espn.com/soccer/story/_/id/49784066/lionel-messi-argentina-career-stats-records-how-compares-cristiano-ronaldo
- Date: 5 November 2026 and 31 August 2026.

---

## 5. Peer and pundit quotes

Each quote below matched the page text exactly. Some reach me through a publisher relaying an interview, so the link is the verifiable source, not the original broadcast. Quotes from speakers who coached or played with the subject carry an obvious loyalty bias.

### On Ronaldo's decisive impact

**Zinedine Zidane, 14 May 2017, after Real Madrid 4-1 Sevilla.** "What can I tell you? He has something, he's different." "He's always there in the decisive moments." Translated quote. Gulf News renders the second line as "In the decisive moments, he's always there."
https://www.sportsmole.co.uk/football/real-madrid/news/zidane-highlights-ronaldo-importance_298222.html

**Zinedine Zidane, 7 April 2017, before the Madrid derby.** "He knows, as we all do, but even more so Cristiano, that in the big games he is always there,"
https://www.goal.com/en-us/news/ronaldo-always-ready-for-the-big-games---zidane-warns-atletico/x5pndt794wi91lut62apuybtl

**Zinedine Zidane, as France coach, October 2026.** "I was lucky enough to have him with me, and he helped me win incredible things, so I take my hat off to Cristiano,"
https://www.beinsports.com/en-us/soccer/uefa-nations-league/articles-video/zidane-defends-cristiano-ronaldo-he-helped-me-win-incredible-things-2026-10-04

**Sir Alex Ferguson, Dublin, 18 May 2016.** "Messi is a Barcelona player." "But Ronaldo could play for Stockport County and score a hat-trick." "He can shoot with both feet, head the ball, he's as brave as a lion." Other outlets word the club list differently, naming Millwall, QPR and Doncaster, and date it to 2015, so link the source you quote.
https://www.football365.com/news/ferguson-messi-would-be-sht-against-stockport

**Carlo Ancelotti, 30 September 2014.** "Without disrespecting anyone, Cristiano is the best player I have coached in my career,"
https://www.espn.com/soccer/story/_/id/37384693/carlo-ancelotti-quiet-leader-cristiano-ronaldo-best-ever-real-madrid

**Toni Kroos, August 2018, to Kicker.** "It'll be difficult to compensate 50 goals per season." "Cristiano has been an important cornerstone for us in the past years, and was instrumental for our successes."
https://www.espn.com/soccer/story/_/id/37559498/real-madrid-replacing-cristiano-ronaldo-50-goals-year-difficult-toni-kroos

**Toni Kroos, before the May 2022 Champions League final, to ZDF. The page is undated.** "Cristiano scored 50 goals per season for us" and "we weren't able to cover Cristiano's 50 goals with just one player until Karim took on that role to perfection."
https://www.fotmob.com/news/nrsj2f0dklmp16jzsoywjg2cz-benzema-has-taken-on-ronaldos-role-to-perfection-%E2%80%93-kroos

**Karim Benzema, March 2021, to El Pais.** "Cristiano's departure allowed me to play a different role. He scored 50 goals every year and you had to adapt to his game."
https://www.goal.com/en/news/ronaldo-scored-50-goals-every-year-you-had-to-adapt-benzema-real-madrid/111r3nl1c5mfk1pti65mkds5i6

**Giorgio Chiellini, October 2021, to DAZN.** "Cristiano needed new stimulus and a team that played for him," and "When he finds a team like that, he is always crucial and has always proved that even in his three years at Juve." He also said: "This creates a shock and I think we paid him in terms of points in the start of the season."
https://www.espn.com/soccer/story/_/id/37621845/giorgio-chiellini-cristiano-ronaldos-late-juventus-departure-affected-team

**Massimiliano Allegri, 12 March 2019, after the Atletico hat-trick.** "It's impossible to think Cristiano would only score one goal in this Champions League,"
https://www.si.com/soccer/2019/03/13/massimiliano-allegri-lauds-hat-trick-hero-cristiano-ronaldo-after-juventus-stun-atletico-madrid

**Eder, after the Euro 2016 final.** "Cristiano told me I would be scoring the winning goal," and "He gave me strength and positive energy. And that goal was really important." FIFA.com carries a different translation: "He gave me this strength, this energy and it was vital." Pick one and link it.
https://www.irishtimes.com/sport/soccer/international/cristiano-ronaldo-told-me-i-would-be-scoring-the-winning-goal-1.2717907
https://www.inside.fifa.com/news/eder-ronaldo-told-me-i-would-score-the-winner-2811658

### On Messi

**Pep Guardiola, 12 May 2015.** "He is the best player of all time. I can compare him with Pele."
https://www.espn.com/soccer/story/_/id/37416583/pep-guardiola-calls-lionel-messi-best-player-all

**Pep Guardiola, December 2016.** "With all the respect to all the players, first to Cristiano Ronaldo" and "I think Messi is on another level."
https://www.si.com/soccer/2016/12/25/pep-guardiola-lionel-messi-cristiano-ronaldo

**Ian Graham, 8 June 2023.** See section 1.10. It is the only quote here from someone speaking from a model.

**Gianluigi Buffon, March 2018, via 90min.** "Messi is more complete, because he starts deeper, has more technical quality and a vision of the game" and "Cristiano Ronaldo, perhaps because he is a little older, has become a killer in the penalty area."
https://www.si.com/soccer/2018/03/23/juventus-legend-gianluigi-buffon-lionel-messi-cristiano-ronaldo-debate

**Wayne Rooney, April 2020, Sunday Times column, in Goal's French translation.** "Mais malgré mon amitié avec Cristiano, j'irais pour Messi". Find the English original before translating it back, because a translation of a translation is no longer his wording. Rooney was Ronaldo's team-mate, which is what makes this one awkward for the Ronaldo case.
https://www.goal.com/fr/news/entre-ronaldo-et-messi-rooney-a-sa-preference/vtbvk9x6r1951a7zvj797cp8v

**Sir Alex Ferguson, on Messi.** "Lionel Messi without question comes into that category." Said on stage at the Ballon d'Or ceremony for the 2011 award, when asked whether Messi belonged with the greatest ever. If the site uses Ferguson's Stockport line, this one is the counter.
https://www.givemesport.com/sir-alex-ferguson-response-lionel-messi-football-goats/

---

## 6. Statistically careful papers on the comparison

### 6.1 Soccer Factor Model

- Claim: Separating skill from team strength, Messi has the higher mean estimate, but the authors treat rankings cautiously.
- Numbers: Plot reading, goals per game above a replacement player: Messi about 0.45, Haaland about 0.42, Ronaldo about 0.37, with overlapping 83% bands. The two men are the only players for whom the model is confident team strength boosted observed output, by about 0.1 goals per 90.
- Method: Bayesian factor model on 144 players and over 33,000 matches, four major leagues, 2000-01 to 2023-24. Team factors are home pitch and point differential. It predicts goals only, so it says nothing about importance or assists.
- Conclusion: "Messi does indeed trump Cristiano", on the mean estimate.
- Favours: Messi, modestly.
- Tier: A, preprint. Andorra and Gobel.
- Source: https://arxiv.org/pdf/2412.05911 (Figure 3)
- Date: December 2024.

### 6.2 Competing failure modes

- Claim: The two are statistically equal in scoring consistency.
- Numbers: Ronaldo 0.72 goals per match, Messi 0.80. Goals analysed: Ronaldo 787 in 1,089 games, Messi 754 in 941. Reliability curves overlap across all 120 minutes. Scored in 48.21% and 52.28% of games.
- Method: Minutes-to-goal survival analysis across six ways of scoring, Transfermarkt data, about 17 years. The authors note it has no adjustment for match importance, home or away, or injury.
- Conclusion: "the same level of consistency".
- Favours: Neutral. The paper's "48 points to 42" is a count of minutes where Ronaldo had more career goals, not football points.
- Tier: A. Anwar, Munawarah, Radhiah, Movement & Sport Sciences.
- Source: https://arxiv.org/pdf/2603.27502
- Date: 29 March 2026.

### 6.3 Large Events Models

- Claim: Simulated into Premier League teams, both lift home points, and the effect depends on the team.
- Numbers: Results are in violin plots only. Neither improves Manchester City's 100-point side. Messi helps Watford more, and Ronaldo helps Leicester more.
- Method: Fine-tuned event models, 2017-18 Premier League, simulated home games.
- Conclusion: The authors say that the impact varies with the players already filling the role.
- Favours: Neutral.
- Tier: A. Mendes-Neves, Meireles, Mendes-Moreira.
- Source: https://arxiv.org/pdf/2402.06815
- Date: February 2024.

### 6.4 American Statistical Association poster

- Claim: Similar scoring once normalised for time, with Messi ahead on creation.
- Numbers: Plots only. The text says Messi outperforms his expected goals "at a greater degree than Ronaldo" and creates more through assists and xGChain.
- Method: Logistic xG and xA models, 2014 to 2021.
- Conclusion: Messi. A student-style competition poster, not a paper.
- Favours: Messi.
- Tier: B-minus.
- Source: https://magazine.amstat.org/wp-content/uploads/2025/08/10-12ThirdPlace.pdf
- Date: Not stated on the poster. The same file also sits under a 2022/07 path on the site, so it predates the 2025 URL.

### 6.5 Michael Caley, three-part series

- Claim: Messi and Ronaldo are alone as scorers in data back to 1987-88. Messi is first and Ronaldo second overall.
- Numbers: Messi assisted about 60% more goals, moved the ball into the penalty area twice as often, made progressive actions 60% more often and created 80% more expected threat. Ronaldo is second in the series' goals-plus-assists ranking behind Messi. Caley chose a five-year peak, and he says context adjustment is left for later work.
- Method: JAWS-style career and peak scores.
- Conclusion: "it is hard to imagine any method that would not credit Messi with far more value to his teams."
- Favours: Messi. Part II is partly paywalled, and the leaderboards are images I could not read.
- Tier: B.
- Source: https://www.expectinggoals.com/p/messi-ronaldo-who-is-the-greatest-statistics-analytics, https://www.expectinggoals.com/p/lionel-messi-and-cristiano-ronaldo and https://www.expectinggoals.com/p/lionel-messi-by-the-numbers-peak
- Date: 9, 18 and 19 July 2026.

### 6.6 PlayeRank

- Claim: Role-based rankings place Messi first in his cluster and Ronaldo second among central forwards, behind Suarez.
- Numbers: No head-to-head, since they sit in different role clusters.
- Method: Wyscout event data, role clustering.
- Favours: Neutral.
- Tier: A. Pappalardo and co-authors.
- Source: https://arxiv.org/pdf/1802.04987
- Date: February 2018 (arXiv).

---

## UNVERIFIED (search snippet only, or source not readable)

Don't publish any of these until someone reads the source.

- VAEP per game in 2017-18, Messi 1.21 and Ronaldo 0.61, from a snippet of a 2019 ioplus or Business Insider story. The Business Insider page failed. Favours Messi. https://ioplus.nl/archive/wp-json/wp/v2/posts/181068
- OptaJose, Real Madrid's Champions League win rate 50% without Ronaldo and 71% with, April 2016. Favours Ronaldo. X was not readable. https://twitter.com/OptaJose/status/725021563515506688
- FootballTransfers, Barcelona xG per 90 of 1.55 after 18 games of 2021-22, the lowest in five seasons. Page returned 403. Favours Messi. https://www.footballtransfers.com/en/transfer-news/es-la-liga/2021-11-barcelona-news-how-barcas-goal-output-collapsed-messi-left
- Top speed at the 2026 World Cup, Ronaldo 33.7 km/h and Messi 30.9 km/h, a Sofascore figure in an X post. Favours Ronaldo. https://x.com/stats_feed/status/2070185586485264423?lang=en
- All-time headers record. Lists give Ronaldo 153 to 158 and Jimmy McGrory 147 to 157, so "record holder" needs a proper source. https://x.com/DataOfStats/status/2105720840793014327?lang=en
- Opta's Champions League record of 25 headed goals for Ronaldo, via a low-grade site. https://finter.dk/most-headed-goals-in-football-history-ronaldo-crouch-klose-and-the-greatest-heading-records/
- Goals in finals across all competitions. Messi 35 in 49 and Ronaldo 25 in 37 per Bolavip, August 2025, on Michel Acosta's data, though its Messi win and loss counts do not sum to 49. Another site has Messi 37 in 44. Favours Messi on both. https://bolavip.com/en/soccer/ronaldo-scores-for-al-nassr-in-saudi-super-cup-how-many-goals-has-he-scored-in-finals-compared-with-lionel-messi
- Ronaldo and Juventus stock, a difference-in-differences estimate of 0.44 euros per share against Roma, and reported rises of about 30%. ResearchGate was not readable, and this is commercial rather than results-based. https://www.researchgate.net/publication/339068380_The_Ronaldo_Effect_Measuring_Stock_Market_Reaction_Utilizing_Difference_in_Differences
- Ronaldo's Serie A effect on attendance, 2.30% league and 4.54% Juventus, a Marca figure relayed by GiveMeSport, not causal. https://www.givemesport.com/1454398-cristiano-ronaldos-impact-on-the-juventus-brand-and-serie-a-in-his-first-seven-months/
- CIES 2013 ranking Messi the most decisive player of 2012-13, ahead of Ribery and Ronaldo. The Inside World Football page returned 403. https://www.insideworldfootball.com/2013/06/13/cies-survey-values-messi-at-twice-ronaldo-and-barca-squad-at-658m/
- A 2020-21 xG paper finding Messi stronger from long range and Ronaldo scoring from all ranges. ResearchGate was not readable. https://www.researchgate.net/publication/376829946_Judging_Messis_and_Ronaldos_scoring_ability_in_different_situations_according_to_the_model
- FiveThirtyEight on penalties, Ronaldo about 85% and Messi about 78%, and "Ronaldo scored an entire goal per 90 fewer with Portugal than with Real Madrid over 2014 to 2018". The archive now redirects, so these rest on snippets. Caley's 85% and 79% are verified in section 2.8. https://fivethirtyeight.com/features/the-world-cup-players-who-step-up-most-for-their-countries/
- Morris, "Lionel Messi Is Impossible", FiveThirtyEight, July 2014. Gizmodo confirms the article exists and its verdict, but no numbers. https://gizmodo.com/statistical-proof-that-lionel-messi-is-the-best-soccer-1599867759
- Squawka on dribbles of 4,052 to 1,958 and big chances created of 587 to 252. Page returned 403. Favours Messi. https://www.squawka.com/en/?p=1447097
- Arsene Wenger in 2013: "It's difficult, Messi was on top until now but in the last year, maybe Ronaldo is in front, he is very athletic." A useful pro-Ronaldo quote, but the page is now 404. https://www.goal.com/en-my/news/3890/england/2013/11/12/4402247/wenger-cristiano-ronaldo-has-overtaken-messi
- Ballon d'Or of All Time. ESPN confirms Ronaldo won it, and snippets say his 2008 season beat Messi's 2012 in a public vote costing one euro per vote. Don't use it as evidence of anything except fan spending. https://www.foxsports.com.mx/2026/10/21/cristiano-ronaldo-aplasta-a-messi-en-las-votaciones-por-el-balon-de-oro-de-todos-los-tiempos/

---

## DO NOT USE

Each of these circulates, and each is wrong, misattributed or too unreliable to print.

- **"Ronaldo hung in the air for 1.5 seconds."** It appeared in a search summary, and Juventus's page does not say it. A 71cm jump gives about 0.76 seconds in the air (derived from free-fall physics), so 1.5 seconds is impossible.
- **Ronaldo's head at 2.93m against Manchester United, February 2013.** DN prints it with no measurer. It would mean over a metre of lift for a 1.85m player, about 40% above his tested maximum.
- **Ronaldo top speed of 40 km/h.** messivsronaldo.app says it, citing footysamba, with no tracking source. It would beat every tested figure here by about 6 km/h.
- **Portugal 76.08% with Ronaldo and 57.14% without, since 2003 (All Football).** 140 wins from 184 caps sits far above the 63% in 3.8. To square the two, Portugal would have needed about 80% wins in his first 13 years, which no source supports. The page has no year on it. Treat it as a likely error. https://m.allfootballapp.com/news/All/How-have-Portugal-performed-without-Cristiano-Ronaldo/2767616
- **Capello's "greatest talent I ever coached was Ronaldo", and Mourinho's "best of the last 20 years" remark after Klose's record.** Both refer to the Brazilian Ronaldo Nazario, not Cristiano. Search summaries mix these up.
- **Ronaldo "9 goals in 40 finals"** (messivsronaldo.app article). It conflicts with his 4 in Champions League finals alone plus his other finals, and with the 25 in 37 cited elsewhere.
- **"Quarter-finals: Ronaldo 20, Messi 10"** (same site, April 2026 article). The site's own Champions League table says 25 and 12, and that table sums correctly. Use the table.
- **"Ronaldo has scored more goals against higher-ranked teams"** (ESPN's sentence). True for the top 10 only. See 2.6.
- **Messi's 19 career World Cup goals (ESPN, 28 June 2026).** A mid-tournament figure. Use 21, from The Analyst on 18 July 2026.

---

## Gaps

- **No published with/without RAPM head-to-head.** Plus-minus papers rank the players, but none isolates them. Your own work would be the first public version I could find.
- **No post-shot xG or goalkeeper-difficulty study on either player.** The nearest is Understat and Caley on pre-shot xG. I found nothing from Opta or StatsBomb that compares them on post-shot xG, or on the quality of the goalkeepers they scored against.
- **No Elo-based study** of either player's move or absence. The hits were method papers only.
- **Goalimpact.** Its public pages show the method but not ratings for either player, and the players page loads no data in a plain fetch. I did not get a figure.
- **American Soccer Analysis.** Goals added covers Messi in MLS, with no Ronaldo. https://www.americansocceranalysis.com/home/2025/7/6/using-goals-added-subcategories-for-player-evaluation
- **StatsBomb.** The Messi data biography gives Messi-only numbers, such as 20 long-range goals from an expected 5 in 2012-13. No head-to-head. https://blogarchive.statsbomb.com/news/messi-data-biography-analysis-and-data-release-2012-13-to-2015-16/
- **Sites I could not read, and did not try to get around.** economist.com and web.archive.org refuse automated fetches. theguardian.com, bbc.co.uk, nytimes.com/theathletic and reuters.com are closed to the search tool. All FiveThirtyEight article URLs now redirect to ABC News. Transfermarkt, FBref and ESPN+ paywalled pieces were not read directly. If you can open The Economist's original, confirm 59.5 and 50.4, and check 0.69 and 0.48 at the same time.
