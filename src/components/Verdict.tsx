import { useRef, useState } from 'react'
import { bothDigits, viewW, words } from '../lib/shapes'
import { stage } from '../lib/stage'
import { useScene } from './Bits'

export function Verdict() {
  const sec = useRef<HTMLDivElement>(null)
  const [busy, setBusy] = useState(false)
  const shape = () => { const W = viewW(); return bothDigits({ ronaldo: [W * 0.27, innerHeight * 0.3], messi: [W * 0.73, innerHeight * 0.3] }, Math.min(W * 0.42, innerHeight * 0.62)) }
  useScene(sec, 'verdict', shape, { start: 'top 65%', end: 'bottom 35%' })
  const siu = () => {
    if (busy) return
    setBusy(true)
    const W = viewW(), H = innerHeight
    stage.field?.shock(W / 2, H * 0.5)
    stage.refresh('verdict', () => words('SIUUU', W * 0.92, W / 2, H * 0.32), 0.7)
    setTimeout(() => stage.field?.shock(W / 2, H * 0.32), 750)
    setTimeout(() => { stage.refresh('verdict', shape, 1.6); setBusy(false) }, 2600)
  }
  return (
    <section id="verdict" className="verdict-wrap" ref={sec}>
      <div className="verdict">
        <div aria-hidden />
        <div className="verdict-text">
          <h2>Every light a goal.</h2>
          <p>Count what his goals changed: Ronaldo. Count the ways he could beat you: Ronaldo. Count creation: Messi. He needs 15 more for 1,000.</p>
          <button className="hold" onClick={siu} disabled={busy}><span className="txt">Siuuu</span></button>
        </div>
      </div>
    </section>
  )
}
