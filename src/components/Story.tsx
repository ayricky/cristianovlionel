import { useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage as lights } from '../lib/stage'
import type { Shape } from '../lib/field'

export interface Step {
  head: ReactNode
  body?: ReactNode
  shape: (plot: HTMLElement, stage: HTMLElement) => Shape
  labels?: ReactNode
  /** Rendered inside the plot, above the lights. */
  over?: ReactNode
  enter?: () => void
}

/** A pinned chapter. Scrolling walks the steps while the lights rearrange. */
export function Story({ id, steps, full, tone, onActive }: { id: string; steps: Step[]; full?: boolean; tone?: string; onActive?: (on: boolean) => void }) {
  const root = useRef<HTMLElement>(null)
  const stageEl = useRef<HTMLDivElement>(null)
  const plot = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(0)
  const cur = useRef(0)
  const latest = useRef(steps)
  latest.current = steps
  const key = `story-${id}`

  useEffect(() => {
    const make = () => latest.current[cur.current].shape(plot.current!, stageEl.current!)
    const walk = ScrollTrigger.create({
      trigger: root.current, start: 'top top', end: 'bottom bottom',
      onUpdate: (s) => {
        const i = Math.min(latest.current.length - 1, Math.floor(s.progress * latest.current.length))
        if (i !== cur.current) {
          cur.current = i
          setStep(i)
          latest.current[i].enter?.()
        }
      },
    })
    const show = ScrollTrigger.create({
      trigger: root.current, start: 'top 45%', end: 'bottom 55%',
      onToggle: (s) => { onActive?.(s.isActive); if (s.isActive) { latest.current[cur.current].enter?.(); lights.enter(key, make, 1.5) } else lights.leave(key) },
    })
    return () => { walk.kill(); show.kill(); lights.leave(key) }
  }, [])

  // Runs after commit, because some shapes read cells the step has just rendered.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    lights.refresh(key, () => latest.current[cur.current].shape(plot.current!, stageEl.current!), 1.15)
  }, [step])

  useEffect(() => {
    if (calm() || !stageEl.current) return
    const on = stageEl.current.querySelectorAll<HTMLElement>(`.cap-step[data-i="${step}"] > *`)
    gsap.fromTo(on, { y: 26, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 -20% 0)', duration: 0.6, ease: 'expo.out', stagger: 0.07, overwrite: true })
  }, [step])

  const s = steps[step]
  return (
    <section id={id} ref={root} className={`story ${full ? 'full' : ''} ${tone ?? ''}`} style={{ height: `${(steps.length + 0.6) * 100}svh` }}>
      <div className="stage" ref={stageEl}>
        <div className="cap">
          <div className="cap-stack">
            {steps.map((x, i) => (
              <div key={i} className={`cap-step ${i === step ? 'on' : ''}`} data-i={i} aria-hidden={i !== step}>
                <div className="cap-head">{x.head}</div>
                {x.body && <div className="cap-body">{x.body}</div>}
              </div>
            ))}
          </div>
        </div>
        <div className="plot" ref={plot}>{s.over}</div>
        <div className="plot-labels">{s.labels}</div>
        <ol className="pips" aria-hidden>{steps.map((_, i) => <li key={i} className={i <= step ? 'on' : ''} />)}</ol>
      </div>
    </section>
  )
}
