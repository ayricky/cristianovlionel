import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { bothDigits, viewW } from '../lib/shapes'
import { eraseTimeline, P } from '../lib/data'
import { sound } from '../lib/sound'

const ROWS = [['flips', 'Results changed'], ['wins', 'Wins gone'], ['points', 'Points gone'], ['trophies', 'Trophies gone']] as const
const make = () => {
  const W = viewW(), H = innerHeight, wide = W > 800
  const y = H * (wide ? 0.42 : 0.36)
  return bothDigits({ ronaldo: [W * 0.26, y], messi: [W * 0.74, y] }, W * (wide ? 0.42 : 0.46))
}

export function Hero() {
  const [value, setValue] = useState(0)
  const [ready, setReady] = useState(false)
  const root = useRef<HTMLElement>(null)
  const prog = useRef({ v: 0 })
  const tween = useRef<gsap.core.Tween | null>(null)
  const line = useMemo(() => ({ r: eraseTimeline('ronaldo'), m: eraseTimeline('messi') }), [])

  useEffect(() => {
    let dead = false, cleanup = () => {}
    document.fonts.load('900 200px "Anybody Variable"').then(() => {
      if (dead) return
      setReady(true)
      const st = ScrollTrigger.create({
        trigger: root.current, start: 'top top', end: 'bottom 45%',
        onLeave: () => stage.leave('hero'), onEnterBack: () => stage.enter('hero', make, 1.6),
      })
      stage.enter('hero', make, 2.2)
      setTimeout(() => stage.field?.shock(viewW() / 2, innerHeight * 0.42), 1900)
      cleanup = () => st.kill()
    })
    if (!calm()) gsap.from('.hero-word', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.07, delay: 0.2 })
    return () => { dead = true; cleanup(); stage.leave('hero') }
  }, [])

  const apply = () => {
    stage.field?.setErase('ronaldo', prog.current.v)
    stage.field?.setErase('messi', prog.current.v)
    setValue(prog.current.v)
  }
  const hold = (e?: React.PointerEvent) => {
    if (e) { try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* pointer already gone */ } }
    navigator.vibrate?.(12)
    tween.current?.kill()
    stage.field?.setPulse(0.5)
    tween.current = gsap.to(prog.current, { v: 1, duration: calm() ? 0.01 : (1 - prog.current.v) * 5.5, ease: 'none', onUpdate: apply, onComplete: () => { stage.field?.setPulse(0); stage.field?.shock(viewW() / 2, innerHeight * 0.42); sound.hit(); sound.roar(); navigator.vibrate?.([30, 40, 60]) } })
  }
  const release = () => { tween.current?.kill(); stage.field?.setPulse(0) }
  const reset = () => { tween.current?.kill(); tween.current = gsap.to(prog.current, { v: 0, duration: calm() ? 0.01 : 0.9, ease: 'power2.inOut', onUpdate: apply }) }
  const onKey = (e: React.KeyboardEvent) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); hold() } }

  const at = (l: typeof line.r) => (value > 0 ? l[Math.min(l.length - 1, Math.floor(value * l.length))] : { flips: 0, wins: 0, points: 0, trophies: 0, iso: '' })
  const r = at(line.r), m = at(line.m)
  const done = value >= 1
  return (
    <section className="hero" ref={root} id="top">
      <div className="hero-photo l" aria-hidden><img src="/img/r-2026.jpg" alt="" /></div>
      <div className="hero-photo x" aria-hidden><img src="/img/m-2022.jpg" alt="" /></div>
      <h1><span className="clip"><span className="hero-word">Take</span></span> <span className="clip"><span className="hero-word">their</span></span> <span className="clip"><span className="hero-word">goals</span></span> <span className="clip"><span className="hero-word">away</span></span></h1>
      <div className="hero-names" aria-hidden><span className="r">Ronaldo</span><span className="m">Messi</span></div>
      <div className="hero-spacer" aria-hidden />
      <div className="hero-foot">
        <dl className="tally">
          {ROWS.map(([k, label]) => (
            <div key={k}>
              <dd className="r">{r[k]}{k === 'trophies' ? <i>/{P('ronaldo').trophyCount.total}</i> : null}</dd>
              <dt>{label}</dt>
              <dd className="m">{m[k]}{k === 'trophies' ? <i>/{P('messi').trophyCount.total}</i> : null}</dd>
            </div>
          ))}
        </dl>
        {done
          ? <button className="hold" onClick={reset}>Put them back</button>
          : <button className="hold" disabled={!ready} onPointerDown={hold} onPointerUp={release} onPointerCancel={release} onKeyDown={onKey} onKeyUp={release} onContextMenu={(e) => e.preventDefault()}>
              <span className="fill" style={{ transform: `scaleX(${value})` }} /><span className="txt">Hold to erase</span>
            </button>}
      </div>
    </section>
  )
}
