import { useEffect, useRef } from 'react'
import { GoalField } from './lib/field'
import { stage } from './lib/stage'
import { COUNT } from './lib/shapes'
import { ScrollTrigger } from './lib/motion'
import { Hero } from './components/Hero'
import { Nav } from './components/Nav'
import { GoalTip } from './components/GoalTip'
import { Compare } from './components/Compare'
import { Scorecards } from './components/Scorecards'
import { Wall } from './components/Wall'
import { Cabinet } from './components/Cabinet'
import { TitleBars } from './components/Races'
import { Ballon } from './components/Ballon'
import { Pitch } from './components/Pitch'
import { Film } from './components/Film'
import { Moments } from './components/Moments'
import { Meetings } from './components/Meetings'
import { Method } from './components/Method'
import { Fold, Part } from './components/Bits'

export function App() {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const field = new GoalField(canvas.current!, COUNT.ronaldo, COUNT.messi)
    stage.attach(field)
    document.fonts.ready.then(() => ScrollTrigger.refresh())
    return () => field.dispose()
  }, [])
  return (
    <>
      <canvas ref={canvas} className="lights" aria-hidden />
      <Nav />
      <main>
        <Hero />
        <div className="page">
          <p className="lead">Count what his goals changed: Ronaldo. Count the ways he could beat you: Ronaldo. Count creation: Messi.</p>
          <Part id="compare" title="Compare"><Compare /></Part>
          <Part id="stats" title="Every stat"><Scorecards /></Part>
          <Part id="results" title="Results and trophies">
            <div className="duo-panels"><Wall /><Cabinet /></div>
            <Fold title="Title seasons, with and without his goals"><div className="split"><TitleBars who="ronaldo" /><TitleBars who="messi" /></div></Fold>
          </Part>
          <Part id="ballon" title="Ballon d'Or, year by year"><Ballon /></Part>
          <Part id="pitch" title="Where they scored"><Pitch /></Part>
          <Part id="film" title="The goals"><Film /><Moments /></Part>
          <Fold title="All 36 meetings"><Meetings /></Fold>
          <Method />
        </div>
      </main>
      <GoalTip />
    </>
  )
}
