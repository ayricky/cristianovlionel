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
import { Film } from './components/Film'
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
import { Poster } from './components/Poster'
import { Legend } from './components/Legend'
import { Gaps } from './components/Gaps'
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
        <Poster img="/img/p-united.jpg" big="Ballon d'Or at 23" sub="Manchester United" alt="Ronaldo celebrating a goal for Manchester United" focus="50% 20%" />
        <Wall />
        <Cabinet />
        <Poster img="/img/p-trophy.jpg" big="Five Champions Leagues" sub="Three in a row, 2016 to 2018" alt="Ronaldo with his Real Madrid team-mates at the 2018 Champions League reception in Madrid" focus="44% 30%" />
        <Legend />
        <Act id="biggest" word="BIG GAMES" />
        <Biggest />
        <Act id="goals" word="THE GOALS" />
        <Film />
        <Clutch />
        <Poster img="/img/p-slide.jpg" big="450 in 438" sub="Goals for Real Madrid" alt="Ronaldo on his knees celebrating a Real Madrid goal against Ludogorets in 2014" focus="60% 40%" />
        <Act id="padded" word="PADDED" />
        <Padding />
        <Act id="gaps-act" word="THE GAPS" />
        <Gaps />
        <Act id="complete" word="COMPLETE" />
        <Feet />
        <PitchMap />
        <Poster img="/img/p-strike.jpg" big="Six World Cups" sub="The only man to score at six" alt="Ronaldo striking the ball for Portugal at the 2018 World Cup" focus="60% 30%" />
        <Ages />
        <Poster img="/img/p-lisbon.jpg" big="Euro 2016" sub="Portugal's first major trophy" alt="Portuguese fans watching Euro 2016 on giant screens in Lisbon" focus="50% 40%" />
        <Country />
        <Cross />
        <Poster img="/img/p-arms.jpg" big="Still scoring at 41" sub="15 goals from 1,000" alt="Ronaldo celebrating a goal for Portugal in Yerevan in 2025" focus="55% 25%" />
        <Verdict />
        <Numbers />
        <Method />
      </main>
      <VideoHost />
      <GoalTip />
    </>
  )
}
