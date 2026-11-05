import type { Shape } from './field'
import { goals, matches, P, type Who } from './data'

export const viewW = () => document.documentElement.clientWidth
const nR = goals('ronaldo').length, nM = goals('messi').length
export const N = nR + nM
export const COUNT = { ronaldo: nR, messi: nM }
const offset = (w: Who) => (w === 'ronaldo' ? 0 : nR)

function blank(): Shape { return { pos: new Float32Array(N * 2), alpha: new Float32Array(N) } }

/** Sample a bitmap of `text` onto a grid of exactly `count` points. */
function digitPoints(text: string, cx: number, cy: number, width: number, count: number) {
  const cv = document.createElement('canvas')
  // Small panels are sampled large and scaled down, so the glyphs stay clean.
  const W = Math.max(600, Math.round(width)), H = Math.round(W * 0.56), k = width / W
  cv.width = W; cv.height = H
  const c = cv.getContext('2d', { willReadFrequently: true })!
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'
  let fs = H * 1.05
  const font = (s: number) => `900 ${s}px "Anybody Variable", Impact, sans-serif`
  c.font = font(fs)
  fs *= Math.min(1, (W * 0.98) / c.measureText(text).width)
  c.font = font(fs)
  c.fillText(text, W / 2, H / 2)
  const img = c.getImageData(0, 0, W, H).data
  const inside = (x: number, y: number) => img[(Math.round(y) * W + Math.round(x)) * 4 + 3] > 128
  const sample = (step: number) => {
    const out: [number, number][] = []
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) if (inside(x, y)) out.push([x, y])
    return out
  }
  let lo = 1, hi = 40
  for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (sample(m).length > count) lo = m; else hi = m }
  const pts = sample(lo)
  // Exactly one light per goal: drop evenly spaced extras.
  while (pts.length > count) pts.splice(Math.floor((pts.length / (pts.length - count)) * 0.5), 1)
  while (pts.length < count) pts.push(pts[pts.length - 1 - (pts.length % 40)])
  pts.sort((a, b) => a[0] + a[1] * 0.2 - (b[0] + b[1] * 0.2))
  return { pts: pts.map(([x, y]) => [(x - W / 2) * k + cx, (y - H / 2) * k + cy] as [number, number]), step: lo * k }
}

export function digits(who: Who, width: number, cx: number, cy: number): Shape {
  const s = blank()
  const text = String(COUNT[who])
  const { pts, step } = digitPoints(text, cx, cy, width, COUNT[who])
  const o = offset(who)
  for (let i = 0; i < COUNT[who]; i++) { s.pos[(o + i) * 2] = pts[i][0]; s.pos[(o + i) * 2 + 1] = pts[i][1]; s.alpha[o + i] = 1 }
  const other: Who = who === 'ronaldo' ? 'messi' : 'ronaldo'
  const oo = offset(other)
  for (let i = 0; i < COUNT[other]; i++) { s.pos[(oo + i) * 2] = Math.random() * viewW(); s.pos[(oo + i) * 2 + 1] = innerHeight + 40 + Math.random() * 200; s.alpha[oo + i] = 0 }
  s.size = Math.max(2.4, step * 0.82)
  return s
}

export function bothDigits(at: Record<Who, [number, number]>, width: number): Shape {
  const s = blank()
  for (const who of ['ronaldo', 'messi'] as Who[]) {
    const { pts, step } = digitPoints(String(COUNT[who]), at[who][0], at[who][1], width, COUNT[who])
    s.size = Math.max(2.4, step)
    const o = offset(who)
    pts.forEach((p, i) => { s.pos[(o + i) * 2] = p[0]; s.pos[(o + i) * 2 + 1] = p[1]; s.alpha[o + i] = 1 })
  }
  return s
}

/** Dim, slow background sky between chapters. */
export function sky(): Shape {
  const s = blank()
  const W = viewW(), H = innerHeight
  for (let i = 0; i < N; i++) {
    s.pos[i * 2] = Math.random() * W
    s.pos[i * 2 + 1] = Math.pow(Math.random(), 1.6) * H * 0.75
    s.alpha[i] = 0.04 + Math.random() * 0.12
  }
  s.size = 2.2
  return s
}

export const anchored = (el: HTMLElement) => {
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top + scrollY, w: r.width, h: r.height }
}

/** Where `el` sits once its sticky stage is pinned to the top of the viewport. */
export const stuck = (el: HTMLElement, stage: HTMLElement) => {
  const r = el.getBoundingClientRect(), t = stage.getBoundingClientRect()
  return { x: r.left, y: r.top - t.top, w: r.width, h: r.height }
}

/**
 * Paired unit columns inside `el`: for each key, Ronaldo's goals stack on the left half and Messi's on the right.
 * `assign(who, goalIndex)` returns the column index, or -1 to hide that light.
 */
export function columns(el: HTMLElement, keys: number, assign: (w: Who, i: number) => number, opts: { hot?: (w: Who, i: number) => boolean; dim?: (w: Who, i: number) => boolean; stage?: HTMLElement } = {}): Shape {
  const s = blank()
  const { hot, dim, stage } = opts
  const box = stage ? stuck(el, stage) : anchored(el)
  const counts = { ronaldo: new Array(keys).fill(0), messi: new Array(keys).fill(0) }
  const pick = {} as Record<Who, number[]>
  for (const w of ['ronaldo', 'messi'] as Who[]) {
    pick[w] = new Array(COUNT[w])
    for (let i = 0; i < COUNT[w]; i++) { const k = assign(w, i); pick[w][i] = k; if (k >= 0) counts[w][k]++ }
  }
  const max = Math.max(...counts.ronaldo, ...counts.messi, 1)
  const colW = box.w / keys
  const half = (colW * 0.86) / 2
  let cell = 2
  for (let c = 16; c >= 1.5; c -= 0.25) {
    const perRow = Math.max(1, Math.floor(half / c))
    if (Math.ceil(max / perRow) * c <= box.h) { cell = c; break }
  }
  const perRow = Math.max(1, Math.floor(half / cell))
  const seen = { ronaldo: new Array(keys).fill(0), messi: new Array(keys).fill(0) }
  for (const w of ['ronaldo', 'messi'] as Who[]) {
    const o = offset(w)
    for (let i = 0; i < COUNT[w]; i++) {
      const k = pick[w][i]
      if (k < 0) { s.pos[(o + i) * 2] = box.x + Math.random() * box.w; s.pos[(o + i) * 2 + 1] = box.y + box.h + 300; s.alpha[o + i] = 0; continue }
      const n = seen[w][k]++
      const col = n % perRow, row = Math.floor(n / perRow)
      const center = box.x + colW * (k + 0.5)
      const x = w === 'ronaldo' ? center - cell * 0.75 - col * cell : center + cell * 0.75 + col * cell
      s.pos[(o + i) * 2] = x
      s.pos[(o + i) * 2 + 1] = box.y + box.h - cell / 2 - row * cell
      s.alpha[o + i] = dim?.(w, i) ? 0.1 : 1
    }
  }
  if (hot) {
    s.hot = new Float32Array(N)
    for (const w of ['ronaldo', 'messi'] as Who[]) for (let i = 0; i < COUNT[w]; i++) if (hot(w, i)) s.hot[offset(w) + i] = 1
  }
  s.anchored = !stage
  s.anchorY = 0
  s.size = Math.max(2.2, Math.min(cell * 0.95, 9))
  return s
}

/* per-goal lookups used by the chapters */
export const lookups = {
  state(w: Who, i: number) { const st = goals(w)[i][3]; return st <= -2 ? 0 : st === -1 ? 1 : st === 0 ? 2 : st === 1 ? 3 : 4 },
  isWinner(w: Who, i: number) { return !!goals(w)[i][5] },
  isLate(w: Who, i: number) { return goals(w)[i][1] >= 80 && goals(w)[i][3] <= 0 && goals(w)[i][3] >= -1 },
  anatomy: (() => {
    const out = {} as Record<Who, number[]>
    for (const w of ['ronaldo', 'messi'] as Who[]) {
      const a = P(w).anatomy
      out[w] = [...Array(a.right).fill(0), ...Array(a.left).fill(1), ...Array(a.head).fill(2), ...Array(a.other).fill(-1)]
    }
    return out
  })(),
  age: (() => {
    const dob = { ronaldo: Date.UTC(1985, 1, 5), messi: Date.UTC(1987, 5, 24) }
    const out = {} as Record<Who, number[]>
    for (const w of ['ronaldo', 'messi'] as Who[]) {
      const rows = matches(w)
      out[w] = goals(w).map((g) => Math.floor((Date.parse(rows[g[0]][0]) - dob[w]) / (365.25 * 864e5)))
    }
    return out
  })(),
}
export { offset }

/** Lights spell a word. */
export function words(text: string, width: number, cx: number, cy: number): Shape {
  const s = blank()
  const { pts, step } = digitPoints(text, cx, cy, width, COUNT.ronaldo)
  for (let i = 0; i < COUNT.ronaldo; i++) { s.pos[i * 2] = pts[i][0]; s.pos[i * 2 + 1] = pts[i][1]; s.alpha[i] = 1 }
  for (let i = nR; i < N; i++) { s.pos[i * 2] = Math.random() * viewW(); s.pos[i * 2 + 1] = innerHeight + 60; s.alpha[i] = 0 }
  s.size = Math.max(2.4, step * 0.86)
  return s
}

/** Goals across the 90 minutes: Ronaldo stacks up from the centre line, Messi hangs down from it. */
export function minuteStrip(el: HTMLElement, stage: HTMLElement): Shape {
  const s = blank()
  const box = stuck(el, stage)
  const bins = 19
  const seen = { ronaldo: new Array(bins).fill(0), messi: new Array(bins).fill(0) }
  const binOf = (w: Who, i: number) => { const m = goals(w)[i][1]; return Math.min(bins - 1, Math.max(0, Math.floor((m - 1) / 5))) }
  for (const w of ['ronaldo', 'messi'] as Who[]) for (let i = 0; i < COUNT[w]; i++) seen[w][binOf(w, i)]++
  const max = Math.max(...seen.ronaldo, ...seen.messi)
  const colW = box.w / bins
  let cell = 3
  for (let c = 9; c >= 1.5; c -= 0.25) { const per = Math.max(1, Math.floor((colW * 0.86) / c)); if (Math.ceil(max / per) * c <= box.h / 2 - 6) { cell = c; break } }
  const per = Math.max(1, Math.floor((colW * 0.86) / cell))
  const fill = { ronaldo: new Array(bins).fill(0), messi: new Array(bins).fill(0) }
  const mid = box.y + box.h / 2
  for (const w of ['ronaldo', 'messi'] as Who[]) {
    const o = offset(w)
    for (let i = 0; i < COUNT[w]; i++) {
      const b = binOf(w, i), n = fill[w][b]++
      const x = box.x + colW * b + (colW - per * cell) / 2 + (n % per) * cell
      const dy = (Math.floor(n / per) + 0.5) * cell + 3
      s.pos[(o + i) * 2] = x; s.pos[(o + i) * 2 + 1] = w === 'ronaldo' ? mid - dy : mid + dy; s.alpha[o + i] = 1
    }
  }
  s.size = Math.max(2.2, Math.min(cell * 0.95, 8))
  return s
}

/** Three lights in each `.trip` cell, one per perfect hat-trick. */
export function triples(cells: HTMLElement[], stage: HTMLElement): Shape {
  const s = blank()
  const rows = matches('ronaldo')
  const list = (P('ronaldo').combos.perfect as { iso: string }[]).map((p) => rows.findIndex((r) => r[0] === p.iso))
  const taken = new Set<number>()
  cells.forEach((c, k) => {
    const b = stuck(c, stage)
    let n = 0
    goals('ronaldo').forEach((g, i) => {
      if (g[0] !== list[k] || n >= 3) return
      s.pos[i * 2] = b.x + b.w * (0.22 + n * 0.28); s.pos[i * 2 + 1] = b.y + b.h * 0.3; s.alpha[i] = 1; taken.add(i); n++
    })
  })
  for (let i = 0; i < N; i++) if (!taken.has(i)) { s.pos[i * 2] = Math.random() * viewW(); s.pos[i * 2 + 1] = Math.random() * innerHeight; s.alpha[i] = 0.05 }
  s.size = 11
  return s
}

/* The shot map. Each Understat goal that matched a row in the goal list becomes that goal's light. */
const HEAD_H = 2.3
const seeded = (a: number, b: number) => { const v = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return v - Math.floor(v) }
export const shotRows = () => (['ronaldo', 'messi'] as Who[]).flatMap((w) => (P(w).shots as number[][]).map((r) => ({
  x: -r[1], y: r[0], h: r[4] === 2 ? HEAD_H : 0.12, goal: !!r[3], type: r[4], who: w === 'ronaldo' ? 0 : 1, seed: seeded(r[0], r[1]),
})))
const mapped = (() => {
  const world = new Float32Array(N * 3)
  const info: { i: number; type: number; sit: number; zone: string; who: Who }[] = []
  for (const w of ['ronaldo', 'messi'] as Who[]) {
    const o = offset(w)
    for (const r of P(w).shots as number[][]) {
      if (!r[3] || r[6] < 0) continue
      const i = o + r[6]
      world.set([-r[1], r[4] === 2 ? HEAD_H : 0.12, r[0]], i * 3)
      const dep = r[0], wide = Math.abs(r[1])
      const zone = r[5] === 4 ? 'pen' : dep <= 5.5 && wide <= 9.16 ? 'six' : dep <= 16.5 && wide <= 20.16 ? (wide > 9.16 ? 'wide' : 'central') : 'outside'
      info.push({ i, type: r[4], sit: r[5], zone, who: w })
    }
  }
  return { world, info }
})()

export interface MapFilter { who?: Who | 'both'; type?: number; zone?: string; sit?: number }
export function pitchLights(f: MapFilter = {}): Shape {
  const s = blank()
  s.world = mapped.world
  for (let i = 0; i < N; i++) { s.pos[i * 2] = viewW() / 2; s.pos[i * 2 + 1] = innerHeight / 2 }
  for (const g of mapped.info) {
    const on = (!f.who || f.who === 'both' || f.who === g.who) && (f.type === undefined || f.type === g.type) && (!f.zone || f.zone === g.zone) && (f.sit === undefined || f.sit === g.sit)
    s.alpha[g.i] = on ? 1 : 0
  }
  s.size = viewW() < 700 ? 6 : 8
  return s
}

const padFlags = { ronaldo: P('ronaldo').padFlags as number[], messi: P('messi').padFlags as number[] }
/**
 * Each player's goals as a tank, side by side at one scale. Padded goals sink to the bottom and glow ember,
 * so the fill level is the share. `within` limits the tank to a subset, such as goals for his country.
 */
export function tanks(el: HTMLElement, stage: HTMLElement, bit: number, within = 0, ember = true): Shape {
  const s = blank()
  const box = stuck(el, stage)
  const gap = Math.min(28, box.w * 0.05)
  const half = (box.w - gap) / 2
  const pool = (w: Who) => padFlags[w].map((f, i) => ({ f, i })).filter((g) => !within || g.f & within)
  const a = pool('ronaldo'), b = pool('messi')
  const n = Math.max(a.length, b.length)
  let cell = 2
  for (let c = 34; c >= 2; c -= 0.25) { if (Math.ceil(n / Math.floor(half / c)) * c <= box.h) { cell = c; break } }
  const cols = Math.floor(half / cell)
  s.hot = new Float32Array(N)
  for (let i = 0; i < N; i++) { s.pos[i * 2] = Math.random() * viewW(); s.pos[i * 2 + 1] = innerHeight + 60 }
  ;(['ronaldo', 'messi'] as Who[]).forEach((w) => {
    const list = pool(w).sort((x, y) => Number(!!(y.f & bit)) - Number(!!(x.f & bit)))
    const o = offset(w), left = w === 'ronaldo' ? box.x : box.x + half + gap
    const pad = (half - cols * cell) / 2
    list.forEach((g, k) => {
      const q = o + g.i
      s.pos[q * 2] = left + pad + (k % cols + 0.5) * cell
      s.pos[q * 2 + 1] = box.y + box.h - (Math.floor(k / cols) + 0.5) * cell
      const on = !!(g.f & bit)
      s.alpha[q] = on ? 1 : ember ? 0.28 : 0.16
      if (on && ember) s.hot![q] = 2
    })
  })
  s.size = Math.max(2.4, Math.min(cell * 0.92, 22))
  return s
}
