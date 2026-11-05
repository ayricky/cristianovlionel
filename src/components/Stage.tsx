import { useEffect, useRef } from 'react'
import { gsap, calm } from '../lib/motion'
import { P } from '../lib/data'
import type { ClipKey } from '../lib/videos'
import { Claim } from './Claim'
import { Video } from './Video'

const r = P('ronaldo'), m = P('messi')
const ROUND: Record<string, string> = { F: 'final', SF: 'semi', QF: 'quarter', R16: 'last 16' }
const NAME: Record<string, string> = { 'Atletico Madrid': 'Atlético', 'Paris Saint-Germain': 'PSG', 'Manchester United': 'Man United' }
const REEL: { year: string; v: string; was: string; now: string; clip: ClipKey }[] = [
  { year: '2008 final', v: 'Chelsea', was: '1-1', now: '0-1', clip: 'final2008' },
  { year: '2016 quarter-final', v: 'Wolfsburg', was: '3-2', now: '0-2', clip: 'wolfsburg2016' },
  { year: '2017 quarter-final', v: 'Bayern Munich', was: '6-3', now: '1-3', clip: 'bayern2017' },
  { year: '2017 semi-final', v: 'Atlético Madrid', was: '4-2', now: '1-2', clip: 'atleti2017' },
  { year: '2018 quarter-final', v: 'Juventus', was: '4-3', now: '1-3', clip: 'bicycle2018' },
  { year: '2019 last 16', v: 'Atlético Madrid', was: '3-2', now: '0-2', clip: 'atleti2019' },
]
const Ties = ({ list }: { list: { opp: string; year: string; round: string }[] }) => <ul className="tie-list">{list.map((t) => <li key={t.opp + t.year}><b>{NAME[t.opp] ?? t.opp}</b><span>{t.year}, {ROUND[t.round]}</span></li>)}</ul>

function Reel() {
  const pin = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (calm() || innerWidth < 900 || innerHeight < 620) return
    const ctx = gsap.context(() => {
      const dist = () => track.current!.scrollWidth - innerWidth + 120
      gsap.to(track.current, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: pin.current, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true } })
    })
    return () => ctx.revert()
  }, [])
  return (
    <div className="reel-pin" ref={pin}>
      <div className="reel" ref={track}>
        <h3 className="reel-title">Without him, these go the other way</h3>
        {REEL.map((n) => (
          <article className="night" key={n.year + n.v}>
            <Video clip={n.clip} />
            <header><span>{n.year}</span><h4>{n.v}</h4></header>
            <p className="swap"><b>{n.was}</b><i>to</i><s>{n.now}</s></p>
          </article>
        ))}
      </div>
    </div>
  )
}

export function Biggest() {
  const b = r.big, c = m.big
  const u = r.ranks.uefa, v = m.ranks.uefa
  return (
    <>
      <Claim id="nights" title="44 goals against Europe's ten best clubs. Messi has 27." r={u[3].goals} m={v[3].goals} rSub={`in ${u[3].apps} Champions League games`} mSub={`in ${v[3].apps} Champions League games`} dots note={`Against the top five it is ${u[2].goals} to ${v[2].goals}.`} />
      <Claim title="From the quarter-finals on, he scored twice as many." r={r.stage.uclQfPlus.goals} m={m.stage.uclQfPlus.goals} rSub={`in ${r.stage.uclQfPlus.apps} games`} mSub={`in ${m.stage.uclQfPlus.apps} games`} dots note={`25 to 12 in quarter-finals. 13 to 6 in semi-finals.`} clip="everyUcl" />
      <Claim title="His goals alone decided eleven Champions League knockout ties." r={b.tiesDecided} m={c.tiesDecided} rSub={`of ${b.tiesWon} won`} mSub={`of ${c.tiesWon} won`} note="Remove his goals from each one and his team goes out.">
        <div className="split rise"><Ties list={b.ties} /><Ties list={c.ties} /></div>
      </Claim>
      <Reel />
      <Claim title="Four knockout hat-tricks. Messi has two." r={b.koHats} m={c.koHats} dots note={`Go-ahead or equalising goals from minute 80 in those knockouts: ${b.koLate} to ${c.koLate}.`} clip="atleti2019" />
      <Claim title="Semi-finals and finals: 31 goals to 19." r={b.semisFinals.goals} m={c.semisFinals.goals} rSub={`in ${b.semisFinals.apps} games`} mSub={`in ${c.semisFinals.apps} games`} dots note="Champions League, World Cup, Euros, Copa América, Nations League and Club World Cup." />
      <Claim title="Bayern Munich, eight games each: nine goals to four." r={b.giants['Bayern Munich'].goals} m={c.giants['Bayern Munich'].goals} rSub="in 8 games" mSub="in 8 games" dots note={`Juventus: ${b.giants.Juventus.goals} in ${b.giants.Juventus.apps} to ${c.giants.Juventus.goals} in ${c.giants.Juventus.apps}.`} clip="bayern2017" />
    </>
  )
}
