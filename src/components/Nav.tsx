import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'

const ITEMS = [['compare', 'Compare'], ['stats', 'Every stat'], ['results', 'Results and trophies'], ['ballon', 'Ballon d\'Or'], ['pitch', 'Where they scored'], ['film', 'The goals'], ['method', 'Method']] as const

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
  const reveal = (id: string) => { const f = document.querySelector<HTMLDetailsElement>(`#${id} details`); if (f) f.open = true }
  const jump = (id: string) => { setOpen(false); reveal(id); document.getElementById(id)?.scrollIntoView() }
  const label = ITEMS.find((x) => x[0] === on)?.[1] ?? 'Chapters'
  return (
    <>
      <nav className="rail" aria-label="Chapters">
        <a href="#top" className="mark" aria-label="Back to top">{minute}'</a>
        <ol>{ITEMS.map(([id, l]) => <li key={id}><a href={`#${id}`} className={on === id ? 'on' : ''} onClick={() => reveal(id)}><span>{l}</span></a></li>)}</ol>
      </nav>
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
