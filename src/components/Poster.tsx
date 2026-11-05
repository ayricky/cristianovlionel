import { useEffect, useRef } from 'react'
import { gsap, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { sound } from '../lib/sound'
import { viewW } from '../lib/shapes'

/** A full-bleed photograph with one line over it. The image drifts as you scroll past. */
export function Poster({ img, big, sub, alt, focus = '50% 30%' }: { img: string; big: string; sub: string; alt: string; focus?: string }) {
  const root = useRef<HTMLElement>(null)
  const pic = useRef<HTMLImageElement>(null)
  const line = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(pic.current, { yPercent: -9, scale: 1.24 }, { yPercent: 9, scale: 1.04, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from(line.current!.children, { yPercent: 60, autoAlpha: 0, skewX: -8, duration: 0.9, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: root.current, start: 'top 45%', once: true, onEnter: () => { stage.field?.shock(viewW() / 2, innerHeight * 0.6); sound.roar(0.7) } } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="poster" ref={root}>
      <img ref={pic} src={img} alt={alt} loading="lazy" style={{ objectPosition: focus }} />
      <div className="poster-line" ref={line}><h2>{big}</h2><p>{sub}</p></div>
    </section>
  )
}
