import { useEffect, useRef, useState } from 'react'
import { gsap, calm } from '../lib/motion'
import { stage } from '../lib/stage'
import { viewW } from '../lib/shapes'
import { sound } from '../lib/sound'

/** Seconds the still holds over a started clip, which is how long YouTube shows its start-up overlay. */
const LEAD_IN = 3

interface Moment { id: string; start: number; end: number; year: string; title: string; sub: string; line: string; was?: string; now?: string; tint: string; channel: string }
/* Start and end seconds were read off each clip's YouTube storyboard. Every id was played from the live origin: some owners block embeds even when YouTube reports them as embeddable. */
export const MOMENTS: Moment[] = [
  { id: 'm47Wd-U4Br8', start: 8, end: 73, year: '2008', title: 'Moscow', sub: 'Champions League final v Chelsea', line: "His header is United's only goal.", was: '1-1', now: '0-1', tint: '#8f0d20', channel: 'CBS Sports Golazo' },
  { id: 'DhSAOW_BVwM', start: 100, end: 146, year: '2012', title: 'Camp Nou', sub: 'Barcelona 1-2 Real Madrid', line: 'The winner in the title decider. Then the gesture.', was: '2-1', now: '1-1', tint: '#6d5a2a', channel: 'beIN SPORTS' },
  { id: 'mwR2TvF3k5w', start: 545, end: 625, year: '2017', title: 'Bernabéu', sub: 'Quarter-final v Bayern Munich', line: 'Five goals over two legs.', was: '6-3', now: '1-3', tint: '#5f5a50', channel: 'CBS Sports Golazo' },
  { id: 'G4vcAxJA0-8', start: 0, end: 88, year: '2017', title: 'Cardiff', sub: 'Champions League final v Juventus', line: 'Two goals in a final, his third scored in.', tint: '#3d2a6d', channel: 'Real Madrid' },
  { id: 'c_JlCriK3fY', start: 2, end: 82, year: '2018', title: 'Turin', sub: 'Quarter-final v Juventus', line: 'The bicycle kick.', was: '4-3', now: '1-3', tint: '#20506d', channel: 'Real Madrid' },
  { id: 'TDl6rBXta0g', start: 58, end: 126, year: '2018', title: 'Sochi', sub: 'World Cup, Portugal 3-3 Spain', line: 'Minute 88. Free kick. Hat-trick.', was: '3-3', now: '0-3', tint: '#7a1020', channel: 'FOX Soccer' },
  { id: 'cLfSpFg6Pxg', start: 330, end: 398, year: '2019', title: 'Turin again', sub: 'Last 16 v Atlético Madrid', line: 'Two down from the first leg. He scores all three.', was: '3-2', now: '0-2', tint: '#4a4a4a', channel: 'Juventus' },
  { id: 'AunImole9HI', start: 12, end: 86, year: '2019', title: 'Genoa', sub: 'Sampdoria 1-2 Juventus', line: 'He met it at 2.56m, 12cm above the crossbar.', was: '2-1', now: '1-1', tint: '#1d3f7a', channel: 'Serie A' },
  { id: 'xbf5KeSFN7I', start: 6, end: 75, year: '2025', title: 'Munich', sub: 'Nations League final v Spain', line: 'The equaliser at 40. Portugal win the shootout.', was: '2-2', now: '1-2', tint: '#7a1020', channel: 'FOX Soccer' },
  { id: 'SNK27spwCuA', start: 303, end: 350, year: '2026', title: 'Riyadh', sub: 'Saudi Pro League title', line: 'Champion again at 41.', was: '1st', now: '3rd', tint: '#6d5a10', channel: 'Saudi Pro League' },
]

/* eslint-disable @typescript-eslint/no-explicit-any */
let api: Promise<any> | null = null
function loadYT() {
  if (!api) api = new Promise((done) => {
    const w = window as any
    if (w.YT?.Player) return done(w.YT)
    const prior = w.onYouTubeIframeAPIReady
    w.onYouTubeIframeAPIReady = () => { prior?.(); done(w.YT) }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(s)
  })
  return api
}

function Scene({ m, n }: { m: Moment; n: number }) {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const player = useRef<any>(null)
  const [on, setOn] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [audible, setAudible] = useState(sound.on)
  const [flip, setFlip] = useState(false)
  const fired = useRef(false)

  useEffect(() => sound.subscribe(setAudible), [])
  // While a clip plays, the colour drains and the score turns over: the same moment, without him.
  useEffect(() => {
    if (!playing || !m.was) return
    let off = 0
    const cycle = () => { setFlip(true); off = window.setTimeout(() => setFlip(false), 3200) }
    const every = window.setInterval(cycle, 10000)
    const first = window.setTimeout(cycle, 4500)
    return () => { clearInterval(every); clearTimeout(first); clearTimeout(off); setFlip(false) }
  }, [playing])
  useEffect(() => {
    // Phones stack scenes, so only the one crossing the middle of the screen plays.
    const stacked = innerWidth <= 640
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), stacked ? { rootMargin: '-42% 0px -42% 0px', threshold: 0 } : { threshold: 0.55 })
    io.observe(frame.current!)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!on) return
    if (!fired.current && !calm()) {
      fired.current = true
      stage.field?.shock(viewW() / 2, innerHeight / 2)
      sound.whistle()
      gsap.fromTo(frame.current, { scale: 0.86, y: 30 }, { scale: 1, y: 0, duration: 0.9, ease: 'expo.out' })
    }
    if (calm()) return
    let dead = false, tried = false, reveal = 0
    const from = Math.max(0, m.start - LEAD_IN)
    // Loop just before the end, so YouTube's replay button and end screen never appear.
    const loop = window.setInterval(() => {
      const p = player.current
      if (p?.getCurrentTime && p.getCurrentTime() >= m.end - 0.4) p.seekTo(from, true)
    }, 250)
    const host = document.createElement('div')
    frame.current!.querySelector('.film-host')!.appendChild(host)
    loadYT().then((YT) => {
      if (dead) return
      player.current = new YT.Player(host, {
        videoId: m.id, width: '100%', height: '100%',
        playerVars: { autoplay: 1, mute: 1, controls: 0, disablekb: 1, playsinline: 1, rel: 0, modestbranding: 1, start: from, fs: 0, iv_load_policy: 3, cc_load_policy: 0 },
        events: {
          onReady: (e: any) => { sound.on ? e.target.unMute() : e.target.mute(); e.target.playVideo() },
          onError: (e: any) => { if (!tried) { tried = true; setTimeout(() => { if (!dead) e.target.loadVideoById({ videoId: m.id, startSeconds: from }) }, 1200) } },
          onStateChange: (e: any) => {
            if (e.data === YT.PlayerState.PLAYING && !reveal) reveal = window.setTimeout(() => setPlaying(true), LEAD_IN * 1000)
            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(from, true); e.target.playVideo() }
          },
        },
      })
    })
    return () => { dead = true; clearInterval(loop); clearTimeout(reveal); setPlaying(false); try { player.current?.destroy() } catch { /* already gone */ } player.current = null; frame.current?.querySelector('.film-host')?.replaceChildren() }
  }, [on])
  useEffect(() => {
    const p = player.current
    if (p?.unMute) { if (audible) p.unMute(); else p.mute() }
    if (on) sound.duck(audible)
    return () => { if (on) sound.duck(false) }
  }, [audible, on])

  const watch = `https://www.youtube.com/watch?v=${m.id}&t=${m.start}s`
  return (
    <section ref={root} className={`film ${on ? 'on' : ''} ${flip ? 'flip' : ''}`} style={{ '--tint': m.tint } as React.CSSProperties} aria-label={`${m.title} ${m.year}`}>
      <div className="film-stage">
        <header className="film-head">
          <p><b>{m.year}</b> {m.sub}</p>
          <h3>{m.title}</h3>
        </header>
        <div className="film-frame" ref={frame}>
          <img src={`https://i.ytimg.com/vi/${m.id}/hqdefault.jpg`} alt="" loading="lazy" className={playing ? 'gone' : ''} />
          <div className="film-host" />
        </div>
        <footer className="film-foot">
          <p className="film-line">{m.line}</p>
          {m.was && <p className="film-swap"><span>Without him</span><b>{m.was}</b><i>to</i><s>{m.now}</s></p>}
          <div className="film-meta">
            <button onClick={() => sound.toggle()} aria-pressed={audible}>{audible ? 'Sound on' : 'Sound off'}</button>
            <a href={watch} target="_blank" rel="noreferrer">{m.channel} on YouTube</a>
            <span>{n}/{MOMENTS.length}</span>
          </div>
        </footer>
      </div>
    </section>
  )
}

export function Film() {
  return <div id="film">{MOMENTS.map((m, i) => <Scene key={m.id} m={m} n={i + 1} />)}</div>
}
