import { useEffect, useRef, useState } from 'react'
import { stage as lights } from '../lib/stage'
import { pitchLights, viewW } from '../lib/shapes'
import { P } from '../lib/data'
import { Story, type Step } from './Story'

const r = P('ronaldo').map, m = P('messi').map
type Rect = [number, number, number, number]

/** Two pitches, one for each player, under the same camera. */
export function PitchMap() {
  const [rects, setRects] = useState<[Rect, Rect] | null>(null)
  const active = useRef(false)
  const pitch = () => lights.field?.pitch
  const layout = () => {
    const cap = document.querySelector<HTMLElement>('#map .cap')
    const W = viewW(), H = innerHeight, gap = 3
    const top = (cap ? cap.offsetTop + cap.offsetHeight : 120) + 8
    const bottom = W < 900 ? H - 62 : H - 12
    const h = bottom - top
    const rs: [Rect, Rect] = W >= h * 1.05
      ? [[0, top, W / 2 - gap, h], [W / 2 + gap, top, W / 2 - gap, h]]
      : [[0, top, W, h / 2 - gap], [0, top + h / 2 + gap, W, h / 2 - gap]]
    lights.field?.setPanels(rs[0], rs[1])
    setRects(rs)
  }
  useEffect(() => {
    const on = () => { if (active.current) layout() }
    addEventListener('resize', on)
    return () => removeEventListener('resize', on)
  }, [])
  const cue = (orbit: number, type: [number, number, number, number], draw: boolean) => () => {
    const p = pitch()
    if (p) { p.orbitTarget = orbit; p.setType(type); p.draw(draw) }
  }
  const tags = (a: string | number, b: string | number, label: string) => rects && (
    <>
      <div className="ptag r" style={{ left: rects[0][0] + 10, top: rects[0][1] + 8 }}><b>{a}</b><span>{label}</span></div>
      <div className="ptag m" style={{ left: rects[1][0] + 10, top: rects[1][1] + 8 }}><b>{b}</b><span>{label}</span></div>
    </>
  )
  const steps: Step[] = [
    { head: <h2>Where they <em>scored</em></h2>, body: <p>Every league goal in Europe, 2014 to 2023.</p>, over: tags(r.goals, m.goals, 'league goals'), shape: () => pitchLights(), enter: cue(0, [1, 1, 1, 1], false) },
    { head: <h2>Close <em>range</em></h2>, over: tags(r.zones.six, m.zones.six, 'in the six-yard box'), shape: () => pitchLights({ zone: 'six' }), enter: cue(1, [1, 1, 1, 1], true) },
    { head: <h2>Off the <em>ground</em></h2>, over: tags(r.head, m.head, 'headers'), shape: () => pitchLights({ type: 2 }), enter: cue(2, [0, 0, 1, 0], true) },
    { head: <h2>From <em>distance</em></h2>, body: <p>Messi's best ground.</p>, over: tags(r.zones.outside, m.zones.outside, 'from outside the box'), shape: () => pitchLights({ zone: 'outside' }), enter: cue(3, [1, 1, 1, 1], true) },
  ]
  return <Story id="map" steps={steps} full onActive={(on) => { active.current = on; const p = pitch(); if (!p) return; p.show(on); if (on) layout(); else p.draw(false) }} />
}
