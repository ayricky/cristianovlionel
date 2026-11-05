import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { fmtSeason, P, trophies, type Who } from '../lib/data'
import { Claim } from './Claim'

const Cup = ({ kind }: { kind: string }) => (
  <svg viewBox="0 0 40 48" aria-hidden className="cup">
    {kind === 'league' ? <path d="M6 5h28v20c0 10-8 16-14 19C14 41 6 35 6 25z" />
      : kind === 'nation' ? <path d="M20 3l5 11 12 1-9 8 3 12-11-6-11 6 3-12-9-8 12-1zM13 39h14v5H13z" />
      : kind === 'europe' ? <path d="M12 4h16c0 3 0 6-.5 9 3-3 6-3 8 0 2 4-1 10-10 12-1 3-3 5-3 7v5h5v5H12v-5h5v-5c0-2-2-4-3-7C5 23 2 17 4 13c2-3 5-3 8 0-.5-3-.5-6-.5-9z" />
      : <path d="M11 4h18v12c0 7-4 11-7 12v8h6v6H12v-6h6v-8c-3-1-7-5-7-12z" />}
  </svg>
)
function Shelf({ who, gone }: { who: Who; gone: boolean }) {
  return (
    <div className={`shelf ${who} ${gone ? 'emptied' : ''}`}>
      {trophies(who).map((t) => <span key={t.comp + t.season} className={`trophy t-${t.status}`} title={`${t.comp} ${fmtSeason(t.season)}: ${t.status}`}><Cup kind={t.kind} /></span>)}
    </div>
  )
}
export function Cabinet() {
  const [gone, setGone] = useState(calm())
  const box = useRef<HTMLDivElement>(null)
  const c = { r: P('ronaldo').trophyCount, m: P('messi').trophyCount }
  useEffect(() => {
    const go = () => {
      setGone(true)
      if (calm()) return
      const tiles = gsap.utils.toArray<HTMLElement>('.t-gone', box.current!)
      tiles.filter((_, i) => i % 7 === 0).forEach((t, i) => setTimeout(() => { const b = t.getBoundingClientRect(); stage.field?.shock(b.left + b.width / 2, b.top + b.height / 2) }, 160 + i * 150))
      gsap.fromTo(tiles, { y: -8, scale: 1.25 }, { y: 0, scale: 1, duration: 0.5, ease: 'bounce.out', stagger: { each: 0.035, from: 'random' } })
    }
    const st = ScrollTrigger.create({ trigger: box.current, start: 'top 62%', once: true, onEnter: go })
    return () => st.kill()
  }, [])
  return (
    <Claim id="cabinet" title="More than half his trophies needed his goals." r={Math.round(c.r.gone / c.r.total * 100)} m={Math.round(c.m.gone / c.m.total * 100)} suffix="%" rSub={`${c.r.gone} of ${c.r.total}`} mSub={`${c.m.gone} of ${c.m.total}`}
      note={`Every league title he won, four of his five Champions Leagues and all three titles with Portugal.`}>
      <div className="split rise" ref={box}><Shelf who="ronaldo" gone={gone} /><Shelf who="messi" gone={gone} /></div>
    </Claim>
  )
}
