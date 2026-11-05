import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { sound } from '../lib/sound'
import type { ClipKey } from '../lib/videos'
import { Count, useInView, useRise } from './Bits'
import { Video } from './Video'

/** One dot per goal, mirrored across the halfway line. The difference needs no reading. */
export function Dots({ r, m }: { r: number; m: number }) {
  const [ref, on] = useInView<HTMLDivElement>()
  const top = Math.max(r, m)
  const size = top > 90 ? 'tiny' : top > 30 ? 'mid' : 'big'
  const fill = (n: number, c: string) => <div className={`dots ${c} ${size}`}>{Array.from({ length: n }, (_, i) => <i key={i} style={{ transitionDelay: `${Math.min(i, 60) * 18}ms` }} />)}</div>
  return <div ref={ref} className={`dot-pair ${on ? 'in' : ''}`} aria-hidden>{fill(r, 'r')}{fill(m, 'm')}</div>
}

interface Props {
  id?: string
  bad?: boolean
  title: ReactNode
  r: number; m: number
  rSub?: string; mSub?: string
  decimals?: number; suffix?: string
  note?: ReactNode
  dots?: boolean
  clip?: ClipKey
  children?: ReactNode
}

/** A single point: the takeaway in a sentence, then the two numbers. */
export function Claim({ id, bad, title, r, m, rSub, mSub, decimals = 0, suffix = '', note, dots, clip, children }: Props) {
  const box = useRef<HTMLElement>(null)
  const nums = useRef<HTMLDivElement>(null)
  useRise(box)
  const rLead = bad ? true : r >= m
  useEffect(() => {
    if (calm()) return
    // The numbers land like a shot: oversized, then hard into place, with the page taking the hit.
    const bs = nums.current!.querySelectorAll('.num > b')
    const lead = nums.current!.querySelector<HTMLElement>('.num.lead > b')
    const tl = gsap.timeline({ paused: true })
    tl.fromTo(bs, { scale: 2.1, autoAlpha: 0, skewX: -10 }, { scale: 1, autoAlpha: 1, skewX: 0, duration: 0.42, ease: 'power4.in', stagger: 0.07 })
      .add(() => {
        const q = lead?.getBoundingClientRect()
        if (q) stage.field?.shock(q.left + q.width / 2, q.top + q.height / 2)
        sound.hit()
      })
      .fromTo(box.current, { x: -7 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.4, .22)' })
    const st = ScrollTrigger.create({ trigger: nums.current, start: 'top 72%', once: true, onEnter: () => tl.play() })
    return () => { st.kill(); tl.kill() }
  }, [])
  return (
    <section id={id} className={`claim ${bad ? 'bad' : ''}`} ref={box}>
      <h2 className="say rise">{title}</h2>
      <div className="nums" ref={nums}>
        <div className={`num r ${rLead ? 'lead' : ''}`}><b><Count to={r} decimals={decimals} suffix={suffix} /></b><span>Ronaldo</span>{rSub && <small>{rSub}</small>}</div>
        <div className={`num m ${!rLead ? 'lead' : ''}`}><b><Count to={m} decimals={decimals} suffix={suffix} /></b><span>Messi</span>{mSub && <small>{mSub}</small>}</div>
      </div>
      {dots && <Dots r={r} m={m} />}
      {children}
      {note && <p className="say-note rise">{note}</p>}
      {clip && <div className="claim-clip rise"><Video clip={clip} /></div>}
    </section>
  )
}
