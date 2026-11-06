import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import type { Shape } from '../lib/field'

const ROLL = '0123456789'.split('')
/** Odometer. Every digit is a column that rolls to its value when it scrolls into view. */
export function Count({ to, decimals = 0, suffix = '', className }: { to: number; decimals?: number; suffix?: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null)
  const [live, setLive] = useState(calm())
  const text = to.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  useEffect(() => {
    if (live) return
    if (el.current!.getBoundingClientRect().top < innerHeight) { const t = setTimeout(() => setLive(true), 60); return () => clearTimeout(t) }
    const st = ScrollTrigger.create({ trigger: el.current, start: 'top 94%', once: true, onEnter: () => setLive(true) })
    return () => st.kill()
  }, [])
  const chars = text.split('')
  return (
    <span ref={el} className={`odo ${className ?? ''}`} aria-label={text}>
      {chars.map((c, i) => {
        const k = chars.length - i
        if (!/[0-9]/.test(c)) return <span key={k} className="odo-c" aria-hidden>{c}</span>
        return (
          <span key={k} className="odo-d" aria-hidden>
            <span className="odo-col" style={{ transform: `translateY(-${(live ? +c : 0) * 10}%)`, transitionDelay: `${(chars.length - i) * 70}ms` }}>
              {ROLL.map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        )
      })}
    </span>
  )
}

export function useScene(ref: React.RefObject<HTMLElement | null>, key: string, make: () => Shape, opts?: { start?: string; end?: string }) {
  const latest = useRef(make)
  latest.current = make
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current, start: opts?.start ?? 'top 70%', end: opts?.end ?? 'bottom 30%',
      onToggle: (s) => (s.isActive ? stage.enter(key, () => latest.current()) : stage.leave(key)),
    })
    return () => { st.kill(); stage.leave(key) }
  }, [])
}

/** Blocks rise when the slide appears. */
export function useRise(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (calm()) return
    const ctx = gsap.context(() => {
      gsap.from(gsap.utils.toArray<HTMLElement>('.rise', ref.current!), { y: 40, autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 })
    }, ref)
    return () => ctx.revert()
  }, [])
}

export function Exhibit({ id, children, tone, sectionRef }: { id: string; children: ReactNode; tone?: string; sectionRef?: React.RefObject<HTMLElement | null> }) {
  const own = useRef<HTMLElement>(null)
  const ref = sectionRef ?? own
  useRise(ref)
  return (
    <section id={id} ref={ref} className={`chapter ${tone ?? ''}`}>
      {children}
    </section>
  )
}

/** Reference material, shut until someone wants it. */
export function Fold({ title, children }: { title: string; children: ReactNode }) {
  return <details className="fold" onToggle={() => ScrollTrigger.refresh()}><summary><h2>{title}</h2></summary>{children}</details>
}

/* All rows share one observer. */
const seen = new WeakMap<Element, () => void>()
const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((es) => {
  for (const e of es) if (e.isIntersecting) { seen.get(e.target)?.(); io?.unobserve(e.target) }
}, { threshold: 0.25 })
export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [on, setOn] = useState(calm())
  useEffect(() => { if (on || !ref.current) return; seen.set(ref.current, () => setOn(true)); io?.observe(ref.current) }, [])
  return [ref, on] as const
}

/** The number a bar should measure: Count's target, a plain number, or "12 in 34" as a rate. */
export function numeric(n: ReactNode): number {
  if (typeof n === 'number') return n
  if (typeof n === 'string') {
    const rate = n.match(/([\d.,]+) (?:in|of) ([\d.,]+)/)
    if (rate) return parseFloat(rate[1].replace(/,/g, '')) / parseFloat(rate[2].replace(/,/g, ''))
    return Math.abs(parseFloat(n.replace(/[^\d.]/g, ''))) || 0
  }
  if (isValidElement(n)) {
    const p = n.props as { to?: number; children?: ReactNode }
    if (typeof p.to === 'number') return p.to
    return numeric(Children.toArray(p.children)[0])
  }
  return 0
}

/** Rough printed length, so the bar leaves room for the widest number in its row. */
function chars(n: ReactNode): number {
  if (typeof n === 'number') return n.toLocaleString('en-GB').length
  if (typeof n === 'string') return n.length
  if (isValidElement(n)) {
    const p = n.props as { to?: number; decimals?: number; children?: ReactNode }
    if (typeof p.to === 'number') return p.to.toLocaleString('en-GB', { minimumFractionDigits: p.decimals ?? 0, maximumFractionDigits: p.decimals ?? 0 }).length
    return Children.toArray(p.children).reduce<number>((t, c) => t + chars(c), 0)
  }
  return 0
}

export interface Stat { k: string; r: string | number; m: string | number; note?: string; low?: boolean; plain?: boolean }

/** One line of a table: the two values with a small mirrored bar. The better value is bold. `low` means lower is better, `plain` means neither is. */
export function StatRow({ k, r, m, note, low, plain }: Stat) {
  const a = numeric(r), b = numeric(m), top = Math.max(a, b) || 1
  const better = plain || a === b ? 0 : (low ? a < b : a > b) ? 1 : 2
  return (
    <div className="st" role="row">
      <div className="st-k" role="rowheader">{k}{low && <em>lower is better</em>}{note && <small>{note}</small>}</div>
      <b className={`st-v ${better === 1 ? 'win' : ''}`} role="cell">{r}</b>
      <div className="st-bar" aria-hidden><i className="l" style={{ width: `${(a / top) * 50}%` }} /><i className="x" style={{ width: `${(b / top) * 50}%` }} /></div>
      <b className={`st-v ${better === 2 ? 'win' : ''}`} role="cell">{m}</b>
    </div>
  )
}

export function Rows({ rows }: { rows: Stat[] }) {
  return (
    <div className="st-table" role="table">
      <div className="st head" role="row"><span /><span className="st-v"><i className="k r" />Ronaldo</span><span /><span className="st-v"><i className="k m" />Messi</span></div>
      {rows.map((s) => <StatRow key={s.k} {...s} />)}
    </div>
  )
}

export function Part({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="part"><h2>{title}</h2>{children}</section>
}

/** Mirror bars growing out from the halfway line. Ronaldo left, Messi right. */
export function Versus({ label, r, m, rNote, mNote, big }: { label: string; r: ReactNode; m: ReactNode; rNote?: string; mNote?: string; big?: boolean }) {
  const [ref, on] = useInView<HTMLDivElement>()
  const a = numeric(r), b = numeric(m), top = Math.max(a, b) || 1
  return (
    <div ref={ref} className={`vs ${big ? 'big' : ''} ${on ? 'in' : ''}`} style={{ '--n': Math.max(chars(r), chars(m)) } as React.CSSProperties}>
      <div className="vs-label">{label}</div>
      <div className={`vs-side l ${a >= b ? 'lead' : ''}`}>
        <div className="vs-num"><b>{r}</b>{rNote && <small>{rNote}</small>}</div>
        <i style={{ '--w': a / top } as React.CSSProperties} />
      </div>
      <div className={`vs-side x ${b >= a ? 'lead' : ''}`}>
        <i style={{ '--w': b / top } as React.CSSProperties} />
        <div className="vs-num"><b>{m}</b>{mNote && <small>{mNote}</small>}</div>
      </div>
    </div>
  )
}
