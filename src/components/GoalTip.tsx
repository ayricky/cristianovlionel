import { useEffect, useRef, useState } from 'react'
import { stage } from '../lib/stage'
import { COUNT } from '../lib/shapes'
import { fmtDate, goals, matches, NAMES, teams, type Who } from '../lib/data'

/** Point at any light to read the goal it stands for. */
export function GoalTip() {
  const [tip, setTip] = useState<{ x: number; y: number; html: { head: string; body: string; who: Who } } | null>(null)
  const last = useRef(-1)
  useEffect(() => {
    let hide = 0
    const move = (e: PointerEvent) => {
      const t = e.target as HTMLElement
      if (e.pointerType !== 'mouse') return
      if (t.closest('button, a, input, .no-tip')) { if (last.current !== -1) { last.current = -1; setTip(null) } return }
      const f = stage.field
      if (!f) return
      f.setPointer(e.clientX, e.clientY)
      const i = f.pick(e.clientX, e.clientY)
      if (i === last.current) { if (i >= 0) setTip((p) => (p ? { ...p, x: e.clientX, y: e.clientY } : p)); return }
      last.current = i
      if (i < 0) { setTip(null); return }
      show(i, e)
    }
    const show = (i: number, e: PointerEvent) => {
      const who: Who = i < COUNT.ronaldo ? 'ronaldo' : 'messi'
      const n = who === 'ronaldo' ? i : i - COUNT.ronaldo
      const g = goals(who)[n]
      const m = matches(who)[g[0]]
      setTip({ x: e.clientX, y: e.clientY, html: { who, head: `${NAMES[who]} goal ${n + 1}`, body: `${teams(who)[m[2]]} ${m[5]}-${m[6]} ${m[3]}, ${g[1]}${g[2] ? '+' + g[2] : ''}', ${fmtDate(m[0])}` } })
      if (e.pointerType !== 'mouse') { clearTimeout(hide); hide = window.setTimeout(() => setTip(null), 3200) }
    }
    const tap = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') return
      const t = e.target as HTMLElement
      if (t.closest('button, a, input, .no-tip')) return
      const f = stage.field
      if (!f) return
      const i = f.pick(e.clientX, e.clientY, 24)
      if (i >= 0) show(i, e)
    }
    addEventListener('pointermove', move, { passive: true })
    addEventListener('pointerdown', tap, { passive: true })
    return () => { removeEventListener('pointermove', move); removeEventListener('pointerdown', tap) }
  }, [])
  if (!tip) return null
  return <div className={`goal-tip ${tip.html.who}`} style={{ left: Math.max(8, Math.min(tip.x + 14, innerWidth - 256)), top: Math.min(tip.y + 16, innerHeight - 96) }}><b>{tip.html.head}</b>{tip.html.body}</div>
}
