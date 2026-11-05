import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, calm } from './lib/motion'
import { GoalField } from './lib/field'
import { stage } from './lib/stage'
import { COUNT, shotRows } from './lib/shapes'
import { VideoHost } from './components/Video'
import { Hero } from './components/Hero'
import { Wall } from './components/Wall'
import { Cabinet } from './components/Cabinet'
import { Clutch } from './components/Clutch'
import { Biggest } from './components/Stage'
import { Case } from './components/Case'
import { Feet } from './components/Feet'
import { PitchMap } from './components/Map'
import { Act } from './components/Act'
import { Ages } from './components/Ages'
import { Country } from './components/Country'
import { Cross } from './components/Cross'
import { Verdict } from './components/Verdict'
import { Method } from './components/Method'
import { Nav } from './components/Nav'
import { GoalTip } from './components/GoalTip'
import { Padding } from './components/Padding'
import { Numbers } from './components/Numbers'

export function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const field = new GoalField(canvas.current!, COUNT.ronaldo, COUNT.messi, shotRows())
    stage.attach(field)
    let lenis: Lenis | null = null
    let tick: ((t: number) => void) | null = null
    if (!calm()) {
      lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1 })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t) => lenis!.raf(t * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    }
    const fonts = document.fonts
    fonts.ready.then(() => ScrollTrigger.refresh())
    return () => { if (tick) gsap.ticker.remove(tick); lenis?.destroy(); field.dispose() }
  }, [])
  return (
    <>
      <canvas ref={canvas} className="lights" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <Case />
        <Wall />
        <Cabinet />
        <Act id="biggest" word="BIG GAMES" />
        <Biggest />
        <Act id="decisive" word="DECISIVE" />
        <Clutch />
        <Act id="padded" word="PADDED" />
        <Padding />
        <Act id="complete" word="COMPLETE" />
        <Feet />
        <PitchMap />
        <Ages />
        <Country />
        <Cross />
        <Verdict />
        <Numbers />
        <Method />
      </main>
      <VideoHost />
      <GoalTip />
    </>
  )
}
