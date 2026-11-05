import credits from '../data/credits.json'
import { CLIPS } from '../lib/videos'
import { MOMENTS } from './Film'

const SOURCES: [string, string][] = [
  ['Match logs, messivsronaldo.app', 'https://www.messivsronaldo.app/match-histories/ronaldo-match-history/'],
  ['League results, football-data.co.uk', 'https://www.football-data.co.uk/data.php'],
  ['Goals dataset, batestguy/messi-vs-ronaldo-r', 'https://github.com/batestguy/messi-vs-ronaldo-r'],
  ['UEFA, Ronaldo records', 'https://www.uefa.com/uefachampionsleague/news/0253-0d820b46805f-b78ccae2c451-1000--what-uefa-records-does-cristiano-ronaldo-hold/'],
  ['ESPN, career totals, 2 Nov 2026', 'https://espn.com/espn/story/_/id/50357130/messi-ronaldo-latest-updates-goat-lionel-messi-winner-937-cristiano-ronaldo-ballon-dor-all-phantom-goal-hattrick-15-away-1000'],
  ['Sky Sports, international retirement', 'https://www.skysports.com/football/news/13593800/cristiano-ronaldo-retires-from-international-football-after-glittering-portugal-career-that-spanned-23-years'],
  ['Hvattum 2020, plus-minus ratings', 'https://doi.org/10.3390/app10207345'],
  ['Decroos et al., VAEP', 'https://arxiv.org/pdf/1802.07127'],
  ['Ian Graham, via The Guardian', 'https://uk.sports.yahoo.com/news/messi-beats-ronaldo-goat-status-150034672.html'],
  ['Juventus, the 2.56m header', 'https://www.juventus.com/en/news/articles/statofthegame-cr7-at-2-56m'],
  ['Sprint speeds, Pachuca study via A-Leagues', 'https://aleagues.com.au/news/hyundai-a-league-player-faster-cristiano-ronaldo-and-lionel-messi/'],
  ['Injury records, World Soccer Talk', 'https://worldsoccertalk.com/news/lionel-messi-vs-cristiano-ronaldo-whos-missed-more-time-with-injuries-in-their-career/'],
  ['Ferguson quote, Football365', 'https://www.football365.com/news/ferguson-messi-would-be-sht-against-stockport'],
  ['League xG, Understat via messivsronaldo.app', 'https://www.messivsronaldo.app/detailed-stats/xg-expected-goals/'],
  ['UEFA Euro 2016 group tables', 'https://en.wikipedia.org/wiki/UEFA_Euro_2016'],
  ['FIFA World Cup records', 'https://en.wikipedia.org/wiki/FIFA_World_Cup_records_and_statistics'],
  ['Lionel Messi career and 2016 retirement', 'https://en.wikipedia.org/wiki/Lionel_Messi'],
  ['Understat shot archive, worldfootballR_data', 'https://github.com/JaseZiv/worldfootballR_data/releases/tag/understat_shots'],
  ['Champions League assists, The Analyst', 'https://theanalyst.com/articles/who-has-the-most-champions-league-assists'],
  ['Headed goals record, World Soccer Talk', 'https://worldsoccertalk.com/news/cristiano-ronaldo-closing-the-gap-to-soccers-all-time-heading-record-how-many-more-does-he-need/'],
]
export function Method() {
  const clips = Object.values(CLIPS)
  return (
    <section id="method" className="chapter method">
      <h2>How this was counted</h2>
      <div className="method-grid">
        <div>
          <h3>The subtraction</h3>
          <p>Every match both men played, to 1 November 2026: 2,527 matches and 1,922 goals. For each match we take his goals off his team's final score and read the new result. Both players get the same treatment.</p>
          <p>It measures what his goals did. It does not measure what the team would have done without him: a replacement might score, and the game would have played out differently.</p>
          <h3>Title races</h3>
          <p>Every league season in England, Spain, Italy and France is rebuilt from football-data.co.uk's results, with his goals removed and opponents credited with the points they gain. The match logs agree with those results on all 1,204 league games. League tiebreak rules apply. The Saudi and MLS tables come from their final standings, with opponents' gains applied to the top teams.</p>
          <h3>Cups</h3>
          <p>Each knockout tie is replayed on aggregate, with away goals where the competition used them. A tie that ends level with no tiebreak counts as a shootout, not a loss. A cup counts as gone if any tie on the run is lost. Group stages are checked by hand for runs that survive the knockouts, which is how Barcelona's 2008-09 Champions League and Portugal's Euro 2016 fall.</p>
          <h3>Score at the time</h3>
          <p>Goals are tagged with the score when they went in, from the match logs. In the second leg of a tie that score is the aggregate, so a tie-winning goal counts as a winner and a goal while trailing in the tie counts as a goal from behind. A comeback here means he scored while his team was behind and they then won, or drew.</p>
          <h3>The pitch</h3>
          <p>Shot locations come from Understat through the worldfootballR archive: league shots in England, Spain, Italy and France, 2014-15 to 2022-23. {'That covers 487 of their 1,922 goals, and 485 are matched to the goal list.'} Where a shot crosses the goal line isn't recorded, so the flight paths end at illustrative points in the net.</p>
          <h3>Stat padding</h3>
          <p>A padded goal here means one of four things: a goal in a win by four or more, a league goal against a side in the bottom three at the time, a friendly goal, or a goal against one of his ten most-scored-against opponents. Bottom-three splits cover Spain, England, Italy and France. Opponent counts favour a long stay in one league, and South American nations have no minnow qualifiers, so friendlies fill that gap for Argentina. The same test on Ronaldo is in the cross-examination.</p>
          <h3>The gaps</h3>
          <p>Every line comes from the same match logs as the rest of the site, with Ronaldo's figure beside it where one exists. The quarter-final run counts Champions League quarter-final games, 2013 to 2019. Finals lost count senior finals for the national team. Shootout misses come from match reports.</p>
          <h3>Opposition and range</h3>
          <p>UEFA top-club splits cover Champions League matches only, using the fan site's coefficient rankings at the time of each match. Named clubs on the page are examples, and every one we checked is listed under Every number, including those where Messi leads. A decided tie is one his team won and would have lost without his goals. Perfect hat-tricks mean a left-foot, right-foot and headed goal in the same match. Keeper counts use the goal list by batestguy, which runs to July 2026. Foot and head balance is the Shannon evenness of the three counts. Champions League assists use UEFA's list. Opta counts differently, and the logs here give 41 to 40. Bars in each row are scaled to the leader of that row, and rows written as 12 in 34 are scaled by goals per game.</p>
          <h3>Counting disputes</h3>
          <p>985 is the headline count. It includes one goal the Saudi league credits and Opta rules an own goal (23 October 2026, v Al Faisaly), and six in the 2023 Arab Club Champions Cup that some databases leave out. Ronaldo leads on every count. Pelé's 1,279 in Guinness includes non-official matches. Trophy counts follow Wikipedia's senior lists: 35 and 45. Messi's total excludes the U-20 and Olympic golds.</p>
          <p>Age totals favour Ronaldo partly through the Saudi league. For ages 35 to 38 alone it is 151 to 147. With-and-without splits are affected by rotation, opposition and injury timing.</p>
        </div>
        <div>
          <h3>Sources</h3>
          <ul className="src">{SOURCES.map(([t, u]) => <li key={u}><a href={u} target="_blank" rel="noreferrer">{t}</a></li>)}</ul>
          <h3>Photos</h3>
          <ul className="src">{Object.values(credits).map((c) => <li key={c.page}><a href={c.page} target="_blank" rel="noreferrer">{c.artist}, {c.license}</a></li>)}</ul>
          <h3>Video</h3>
          <p>Clips from {[...new Set([...clips.map((c) => c.channel), ...MOMENTS.map((c) => c.channel)])].join(', ')}, played from YouTube. Nothing is hosted here.</p>
        </div>
      </div>
      <p className="legal">Fan project. Not affiliated with either player, any club, league or federation.</p>
    </section>
  )
}
