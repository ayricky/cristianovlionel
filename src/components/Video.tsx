import { useEffect, useRef, useState } from 'react'
import { gsap, calm } from '../lib/motion'
import { CLIPS, type Clip, type ClipKey } from '../lib/videos'

let open: (c: Clip) => void = () => {}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
const watchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

export function Video({ clip, wide }: { clip: ClipKey; wide?: boolean }) {
  const c: Clip = CLIPS[clip]
  const inner = (
    <>
      <img src={`https://i.ytimg.com/vi/${c.id}/hqdefault.jpg`} alt="" loading="lazy" />
      <span className="v-play" aria-hidden><svg viewBox="0 0 24 24"><path d="M7 4.5v15l13-7.5z" /></svg></span>
      <span className="v-time">{mmss(c.secs)}</span>
      <span className="v-cap"><b>{c.title}</b><small>{c.channel}{c.embed ? '' : ', opens YouTube'}</small></span>
    </>
  )
  return c.embed
    ? <button className={`video ${wide ? 'wide' : ''}`} onClick={() => open(c)} aria-label={`Play ${c.title}`}>{inner}</button>
    : <a className={`video ${wide ? 'wide' : ''}`} href={watchUrl(c.id)} target="_blank" rel="noreferrer" aria-label={`${c.title}, opens YouTube`}>{inner}</a>
}

export function VideoHost() {
  const [clip, setClip] = useState<Clip | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const close = useRef<HTMLButtonElement>(null)
  useEffect(() => { open = setClip }, [])
  useEffect(() => {
    if (!clip) return
    close.current?.focus()
    if (!calm()) gsap.from(box.current, { scale: 0.86, skewX: -6, autoAlpha: 0, duration: 0.45, ease: 'expo.out' })
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setClip(null) }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [clip])
  if (!clip) return null
  return (
    <div className="v-host" role="dialog" aria-modal="true" aria-label={clip.title} onClick={() => setClip(null)}>
      <div className="v-box" ref={box} onClick={(e) => e.stopPropagation()}>
        <iframe src={`https://www.youtube-nocookie.com/embed/${clip.id}?autoplay=1&rel=0`} title={clip.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
        <div className="v-bar">
          <span>{clip.title}, {clip.channel}</span>
          <a href={watchUrl(clip.id)} target="_blank" rel="noreferrer">Watch on YouTube</a>
          <button ref={close} onClick={() => setClip(null)}>Close</button>
        </div>
      </div>
    </div>
  )
}
