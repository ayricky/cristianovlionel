import { useEffect, useRef } from 'react'
import { gsap, calm } from '../lib/motion'
import { P } from '../lib/data'

const r = P('ronaldo')
const ROWS = [
  [`${r.totals.goals} official goals`, 'Most official senior goals', `${r.intl.goals} for Portugal`, `${r.intl.apps} caps`],
  [`${r.byComp['Champions League'].goals} Champions League goals`, '67 in the knockouts', '17 in one season', '7 times top scorer'],
  ['Scored at 6 World Cups', '14 Euro goals', '5 Ballons d\'Or', '5 Champions Leagues'],
]

/** The records, pushed sideways by the scroll. */
export function Legend() {
  const root = useRef<HTMLElement>(null)
  useEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.leg-row', root.current!).forEach((row, i) => {
        const left = i % 2 === 0
        gsap.fromTo(row, { xPercent: left ? 0 : -30 }, { xPercent: left ? -30 : 0, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 } })
      })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section className="legend-wall" ref={root} aria-label="His records">
      {ROWS.map((row, i) => (
        <div className="leg-row" key={i}>
          {[...row, ...row, ...row].map((t, k) => <span key={k} className={k % 2 ? 'solid' : ''}>{t}</span>)}
        </div>
      ))}
    </section>
  )
}
