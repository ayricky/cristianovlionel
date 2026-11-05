import type { ReactNode } from 'react'
import { Count, useInView, useRise } from './Bits'
import { Video } from './Video'
import type { ClipKey } from '../lib/videos'
import { useRef } from 'react'

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
export function Claim({ id, title, r, m, rSub, mSub, decimals = 0, suffix = '', note, dots, clip, children }: Props) {
  const box = useRef<HTMLElement>(null)
  useRise(box)
  const rLead = r >= m
  return (
    <section id={id} className="claim" ref={box}>
      <h2 className="say rise">{title}</h2>
      <div className="nums rise">
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
