/** All sound is synthesised in the browser, so there is nothing to license and nothing plays until asked. */
class Sound {
  on = false
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private crowd: GainNode | null = null
  private noise: AudioBuffer | null = null
  private subs = new Set<(v: boolean) => void>()

  subscribe(f: (v: boolean) => void) { this.subs.add(f); return () => { this.subs.delete(f) } }

  private start() {
    const ctx = new AudioContext()
    this.ctx = ctx
    this.master = ctx.createGain()
    this.master.gain.value = 0.7
    this.master.connect(ctx.destination)
    const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    this.noise = buf
    // the crowd: band-limited noise that breathes
    const src = ctx.createBufferSource()
    src.buffer = buf; src.loop = true
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'; band.frequency.value = 780; band.Q.value = 0.5
    const gain = ctx.createGain()
    gain.gain.value = 0.05
    const lfo = ctx.createOscillator(), depth = ctx.createGain()
    lfo.frequency.value = 0.13; depth.gain.value = 0.016
    lfo.connect(depth).connect(gain.gain)
    src.connect(band).connect(gain).connect(this.master)
    src.start(); lfo.start()
    this.crowd = gain
  }

  toggle() {
    this.on = !this.on
    if (this.on) {
      if (!this.ctx) this.start()
      void this.ctx!.resume()
      this.whistle()
    } else void this.ctx?.suspend()
    this.subs.forEach((f) => f(this.on))
  }

  /** Lower the crowd while a clip's own audio plays. */
  duck(v: boolean) { if (this.crowd && this.ctx) this.crowd.gain.setTargetAtTime(v ? 0.008 : 0.05, this.ctx.currentTime, 0.4) }

  /** Ball strike. */
  hit(level = 1) {
    if (!this.on || !this.ctx) return
    const c = this.ctx, t = c.currentTime
    const o = c.createOscillator(), g = c.createGain()
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.16)
    g.gain.setValueAtTime(0.75 * level, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    o.connect(g).connect(this.master!)
    o.start(t); o.stop(t + 0.3)
  }

  /** The crowd goes up. */
  roar(level = 1) {
    if (!this.on || !this.ctx) return
    const c = this.ctx, t = c.currentTime
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain()
    s.buffer = this.noise; s.loop = true
    f.type = 'bandpass'; f.Q.value = 0.4
    f.frequency.setValueAtTime(420, t); f.frequency.linearRampToValueAtTime(1500, t + 0.9)
    g.gain.setValueAtTime(0.001, t); g.gain.exponentialRampToValueAtTime(0.42 * level, t + 0.55); g.gain.exponentialRampToValueAtTime(0.001, t + 3)
    s.connect(f).connect(g).connect(this.master!)
    s.start(t); s.stop(t + 3.1)
  }

  whistle() {
    if (!this.on || !this.ctx) return
    const c = this.ctx, t = c.currentTime
    for (const hz of [2850, 3020]) {
      const o = c.createOscillator(), g = c.createGain()
      o.frequency.value = hz
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.02); g.gain.setValueAtTime(0.05, t + 0.42); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
      o.connect(g).connect(this.master!)
      o.start(t); o.stop(t + 0.52)
    }
  }
}
export const sound = new Sound()
