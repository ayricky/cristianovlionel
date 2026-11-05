import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { eraseOf, fmtDate, matches, res, teams, type Row, type Who } from '../lib/data'
import { useRise } from './Bits'

const BASE: Record<Who, string> = { ronaldo: '#5b4522', messi: '#274659' }
const MOST = Math.max(matches('ronaldo').length, matches('messi').length)

/** Both walls share one column count and one square size, so more matches means a taller wall. */
function OneWall({ who, sweep }: { who: Who; sweep: { e: number } }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const rows = matches(who)
  const geo = useRef({ cell: 8, cols: 40 })
  const [tip, setTip] = useState<Row | null>(null)
  const draw = () => {
    const c = cv.current
    if (!c) return
    const W = c.parentElement!.clientWidth, n = rows.length
    const dpr = Math.min(devicePixelRatio, 2)
    const aim = innerWidth < 700 ? 300 : 460
    const cell = Math.max(3, Math.floor(Math.sqrt((W * aim) / MOST) * 4) / 4)
    const cols = Math.floor(W / cell), h = Math.ceil(n / cols) * cell
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(h * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(h * dpr); c.style.height = `${h}px` }
    geo.current = { cell, cols }
    const g = c.getContext('2d')!
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.clearRect(0, 0, W, h)
    const at = sweep.e * 1.25, s = cell - Math.max(0.75, cell * 0.14)
    rows.forEach((r, i) => {
      const flips = res(r[5], r[6]) !== res(r[5] - r[7], r[6])
      const k = Math.min(1, Math.max(0, (at - i / n) * 8))
      const lit = flips && k > 0
      const size = lit ? s * (1 + Math.sin(k * Math.PI) * 0.8) : s
      g.fillStyle = lit ? '#ff5a2a' : BASE[who]
      g.fillRect((i % cols) * cell + (s - size) / 2, Math.floor(i / cols) * cell + (s - size) / 2, size, size)
    })
  }
  useEffect(() => {
    draw()
    const t = () => draw()
    gsap.ticker.add(t)
    return () => gsap.ticker.remove(t)
  }, [])
  const look = (e: React.PointerEvent) => {
    const b = cv.current!.getBoundingClientRect(), { cell, cols } = geo.current
    const x = Math.floor((e.clientX - b.left) / cell), y = Math.floor((e.clientY - b.top) / cell)
    setTip(x < cols ? rows[y * cols + x] ?? null : null)
  }
  const s = eraseOf(rows)
  return (
    <figure className="wall">
      <figcaption className="wall-big"><b className={who === 'ronaldo' ? 'r' : 'm'}>{s.flips}</b><span>of {rows.length.toLocaleString('en-GB')} matches</span></figcaption>
      <canvas ref={cv} className="no-tip" onPointerMove={look} onPointerDown={look} onPointerLeave={() => setTip(null)} role="img" aria-label={`${rows.length} ${who} matches, ${s.flips} of them change result without his goals`} />
      <p className="wall-tip">{tip ? `${teams(who)[tip[2]]} ${tip[5]}-${tip[6]} ${tip[3]}, ${fmtDate(tip[0])}` : ' '}</p>
    </figure>
  )
}

export function Wall() {
  const sweep = useRef({ e: 0 })
  const box = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLElement>(null)
  useRise(root)
  useEffect(() => {
    const go = () => { if (calm()) sweep.current.e = 1; else gsap.to(sweep.current, { e: 1, duration: 2.2, ease: 'none' }) }
    const st = ScrollTrigger.create({ trigger: box.current, start: 'top 60%', once: true, onEnter: go })
    return () => st.kill()
  }, [])
  return (
    <section id="wall" className="claim" ref={root}>
      <h2 className="say rise">Take his goals away and {eraseOf(matches('ronaldo')).flips} results change.</h2>
      <p className="say-note rise">Each square is a match. Lit squares are the ones his goals decided.</p>
      <div className="split rise" ref={box}><OneWall who="ronaldo" sweep={sweep.current} /><OneWall who="messi" sweep={sweep.current} /></div>
    </section>
  )
}
