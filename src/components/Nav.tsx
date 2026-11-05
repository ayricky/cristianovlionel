import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'

const ITEMS = [['case', 'The case'], ['wall', 'Results'], ['cabinet', 'Trophies'], ['nights', 'Big games'], ['film', 'The goals'], ['clutch', 'Clutch'], ['padding', 'Stat padding'], ['feet', 'Feet and head'], ['map', 'The pitch'], ['ages', 'Longevity'], ['country', 'Country'], ['cross', 'Cross-exam'], ['verdict', 'Verdict'], ['numbers', 'Every number'], ['method', 'Method']] as const

export function Nav() {
  const [on, setOn] = useState('')
  const [minute, setMinute] = useState(0)
  const [open, setOpen] = useState(false)
  const [past, setPast] = useState(false)
  useEffect(() => {
    const sts = ITEMS.map(([id]) => ScrollTrigger.create({ trigger: `#${id}`, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && setOn(id) }))
    const clock = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => { setMinute(Math.round(s.progress * 90)); setPast(s.scroll() > innerHeight * 0.7) } })
    return () => { sts.forEach((s) => s.kill()); clock.kill() }
  }, [])
  const jump = (id: string) => { setOpen(false); document.getElementById(id)?.scrollIntoView() }
  const label = ITEMS.find((x) => x[0] === on)?.[1] ?? 'Chapters'
  return (
    <>
      <nav className="rail" aria-label="Chapters">
        <a href="#top" className="mark" aria-label="Back to top">{minute}'</a>
        <ol>{ITEMS.map(([id, l]) => <li key={id}><a href={`#${id}`} className={on === id ? 'on' : ''}><span>{l}</span></a></li>)}</ol>
      </nav>
      <div className={`sides ${past ? 'show' : ''}`} aria-hidden><span className="r">Ronaldo</span><span className="m">Messi</span></div>
      <div className={`dock ${past ? 'show' : ''}`}>
        <button onClick={() => setOpen(!open)} aria-expanded={open}><b>{minute}'</b><span>{label}</span><i aria-hidden>{open ? 'Close' : 'Menu'}</i></button>
      </div>
      {open && (
        <div className="sheet" onClick={() => setOpen(false)}>
          <ol onClick={(e) => e.stopPropagation()}>{ITEMS.map(([id, l]) => <li key={id}><button className={on === id ? 'on' : ''} onClick={() => jump(id)}>{l}</button></li>)}</ol>
        </div>
      )}
    </>
  )
}
