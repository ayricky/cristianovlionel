import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { viewW, words } from '../lib/shapes'

/** Lights spell the act's name, then a shockwave clears them. */
export function Act({ word, id }: { word: string; id: string }) {
  const root = useRef<HTMLElement>(null)
  const beam = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const key = `act-${id}`
    const make = () => words(word, viewW() * 0.92, viewW() / 2, innerHeight * 0.5)
    const st = ScrollTrigger.create({
      trigger: root.current, start: 'top 30%', end: 'bottom 70%',
      onToggle: (s) => {
        if (s.isActive) { stage.enter(key, make, 1.3); setTimeout(() => stage.field?.shock(viewW() / 2, innerHeight / 2), 950) } else stage.leave(key)
      },
    })
    let tw: gsap.core.Tween | undefined
    if (!calm()) tw = gsap.fromTo(beam.current, { rotate: -24, opacity: 0 }, { rotate: 24, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
    return () => { st.kill(); tw?.scrollTrigger?.kill(); tw?.kill(); stage.leave(key) }
  }, [])
  return (
    <section className="act" id={id} ref={root} aria-label={word}>
      <div className="act-stage"><div className="act-beam" ref={beam} /><h2 className="sr">{word}</h2></div>
    </section>
  )
}
