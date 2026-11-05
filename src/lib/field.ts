import * as THREE from 'three'
import { calm } from './motion'
import { Pitch, type ShotRow } from './pitch'

/**
 * Every goal either player scored, drawn as one light. The lights hold a shape (digits, unit charts) and
 * travel to the next one. Shapes pinned to a DOM element scroll with the page through uOffsetFrom/To.
 */
const vert = /* glsl */ `
attribute vec2 aFrom; attribute vec2 aTo; attribute vec3 aWorld;
attribute float aAlphaFrom; attribute float aAlphaTo;
attribute float aSeed; attribute float aOrder; attribute float aWho; attribute float aHot;
uniform float uMix, uTime, uDpr, uSize, uEraseR, uEraseM, uFall, uPulse, uOffFrom, uOffTo, uAnchorFrom, uAnchorTo;
uniform vec2 uRes; uniform vec2 uPointer; uniform mat4 uVP; uniform float uWorldFrom, uWorldTo; uniform vec3 uShock; uniform vec4 uPanelR, uPanelM;
varying float vAlpha; varying float vWho; varying float vHot; varying float vFlash;
void main() {
  float d = aSeed * 0.45;
  float m = smoothstep(d, d + 0.55, uMix);
  float e = m * m * (3.0 - 2.0 * m);
  vec2 a = aFrom; a.y -= uOffFrom * uAnchorFrom;
  vec2 b = aTo;   b.y -= uOffTo * uAnchorTo;
  if (uWorldFrom + uWorldTo > 0.0) {
    vec4 c = uVP * vec4(aWorld, 1.0);
    vec4 pn = aWho < 0.5 ? uPanelR : uPanelM;
    vec2 sc = pn.xy + vec2(c.x / c.w * 0.5 + 0.5, 0.5 - c.y / c.w * 0.5) * pn.zw;
    a = mix(a, sc, uWorldFrom); b = mix(b, sc, uWorldTo);
  }
  vec2 p = mix(a, b, e);
  float arc = sin(3.14159 * e);
  vec2 dir = normalize(b - a + vec2(0.001));
  p += vec2(-dir.y, dir.x) * arc * (aSeed - 0.5) * 240.0;
  float alpha = mix(aAlphaFrom, aAlphaTo, e);

  float eraseAt = aWho < 0.5 ? uEraseR : uEraseM;
  float t = clamp((eraseAt * 1.04 - aOrder) * 26.0, 0.0, 1.0);
  vFlash = t * (1.0 - t) * 4.0;
  p.y += t * t * (uFall * (0.6 + aSeed));
  p.x += t * t * (aSeed - 0.5) * 220.0;
  alpha *= 1.0 - smoothstep(0.55, 1.0, t);

  float boom = 0.0;
  if (uShock.z < 1.0) {
    vec2 ds = p - uShock.xy; float dl = length(ds) + 0.001;
    float front = uShock.z * (uRes.x + uRes.y) * 0.9;
    boom = exp(-abs(dl - front) / 70.0) * (1.0 - uShock.z);
    p += ds / dl * boom * 70.0;
    alpha = min(1.0, alpha + boom * 0.8);
  }

  vec2 dp = p - uPointer; float r = length(dp) + 0.001;
  p += dp / r * smoothstep(120.0, 0.0, r) * 22.0;

  float tw = 0.85 + 0.15 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 40.0);
  vAlpha = alpha * tw; vWho = aWho; vHot = aHot;
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = uSize * uDpr * (1.0 + vFlash * 2.2 + uPulse * 0.6 * sin(aOrder * 30.0 + uTime * 4.0)) * (1.0 + min(aHot, 1.0) * 0.35 + boom * 1.6);
}`
const frag = /* glsl */ `
precision highp float;
varying float vAlpha; varying float vWho; varying float vHot; varying float vFlash;
void main() {
  vec2 q = gl_PointCoord - 0.5;
  float r = length(q) * 2.0;
  if (r > 1.0) discard;
  float core = smoothstep(0.6, 0.12, r);
  float halo = pow(1.0 - r, 1.8) * 0.6;
  vec3 gold = vec3(1.0, 0.745, 0.2); vec3 sky = vec3(0.45, 0.82, 1.0); vec3 ember = vec3(1.0, 0.33, 0.14);
  vec3 c = mix(gold, sky, vWho);
  c = mix(c, vec3(1.0, 0.98, 0.92), core * 0.28 + min(vHot, 1.0) * 0.72);
  if (vHot > 1.5) c = mix(ember, vec3(1.0, 0.86, 0.7), core * 0.5);
  c = mix(c, ember, clamp(vFlash, 0.0, 1.0));
  gl_FragColor = vec4(c, (core + halo) * vAlpha);
}`

export interface Shape { pos: Float32Array; alpha: Float32Array; hot?: Float32Array; anchored?: boolean; anchorY?: number; size?: number; world?: Float32Array }

export class GoalField {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private cam = new THREE.Camera()
  private mat: THREE.ShaderMaterial
  private geo = new THREE.BufferGeometry()
  private raf = 0
  private tween = { mix: 1 }
  private start = performance.now()
  readonly n: number
  current: Shape | null = null
  private pointer = new THREE.Vector2(-9999, -9999)
  private scrollY = 0
  private mixFrom = 0
  private mixStart = 0
  private mixDur = 0
  private sizeTarget = 2.6

  pitch: Pitch
  private shockT = 1

  private nM: number

  constructor(canvas: HTMLCanvasElement, nR: number, nM: number, shots: ShotRow[]) {
    this.n = nR + nM
    this.nM = nM
    this.pitch = new Pitch(shots)
    const gl = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' })
    gl.setClearColor(0, 0)
    gl.autoClear = false
    this.renderer = gl
    const n = this.n
    const seed = new Float32Array(n), order = new Float32Array(n), who = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const isM = i >= nR
      seed[i] = Math.random(); who[i] = isM ? 1 : 0
      order[i] = isM ? (i - nR) / nM : i / nR
    }
    const zero = () => new THREE.BufferAttribute(new Float32Array(n * 2), 2)
    const z1 = () => new THREE.BufferAttribute(new Float32Array(n), 1)
    this.geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    this.geo.setAttribute('aFrom', zero()); this.geo.setAttribute('aTo', zero())
    this.geo.setAttribute('aAlphaFrom', z1()); this.geo.setAttribute('aAlphaTo', z1()); this.geo.setAttribute('aHot', z1())
    this.geo.setAttribute('aWorld', new THREE.BufferAttribute(new Float32Array(n * 3), 3))
    this.geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    this.geo.setAttribute('aOrder', new THREE.BufferAttribute(order, 1))
    this.geo.setAttribute('aWho', new THREE.BufferAttribute(who, 1))
    this.mat = new THREE.ShaderMaterial({
      vertexShader: vert, fragmentShader: frag, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 1 }, uTime: { value: 0 }, uDpr: { value: 1 }, uSize: { value: 2.6 }, uEraseR: { value: 0 }, uEraseM: { value: 0 }, uFall: { value: 900 },
        uPulse: { value: 0 }, uOffFrom: { value: 0 }, uOffTo: { value: 0 }, uAnchorFrom: { value: 0 }, uAnchorTo: { value: 0 },
        uRes: { value: new THREE.Vector2(1, 1) }, uPointer: { value: this.pointer }, uVP: { value: this.pitch.vp }, uWorldFrom: { value: 0 }, uWorldTo: { value: 0 }, uShock: { value: new THREE.Vector3(0, 0, 1) }, uPanelR: { value: new THREE.Vector4(0, 0, 1, 1) }, uPanelM: { value: new THREE.Vector4(0, 0, 1, 1) },
      },
    })
    const pts = new THREE.Points(this.geo, this.mat)
    pts.frustumCulled = false
    this.scene.add(pts)
    this.resize()
    this.loop = this.loop.bind(this)
    this.raf = requestAnimationFrame(this.loop)
  }

  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const box = this.renderer.domElement
    const w = box.clientWidth || innerWidth, h = box.clientHeight || innerHeight
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.mat.uniforms.uDpr.value = dpr
    this.mat.uniforms.uRes.value.set(w, h)
    this.mat.uniforms.uFall.value = h * 1.2
    this.pitch.setSize(w, h, dpr)
  }

  setPointer(x: number, y: number) { this.pointer.set(x, y) }
  setErase(w: 'ronaldo' | 'messi', v: number) { this.mat.uniforms[w === 'ronaldo' ? 'uEraseR' : 'uEraseM'].value = v }
  setPulse(v: number) { this.mat.uniforms.uPulse.value = v }
  /** Give each player a rectangle of the viewport for the 3D pitch. */
  setPanels(r: [number, number, number, number], m: [number, number, number, number]) {
    const u = this.mat.uniforms
    u.uPanelR.value.set(...r); u.uPanelM.value.set(...m)
    this.panels = [r, m]
    this.pitch.setAspect(r[2] / r[3])
  }
  private panels: [number, number, number, number][] = []

  /** Shockwave through the lights from a viewport point. */
  shock(x: number, y: number) { if (calm()) return; this.mat.uniforms.uShock.value.set(x, y, 0); this.shockT = performance.now() }

  /** Travel to a shape. `dur` 0 snaps. */
  go(s: Shape, dur = 1.5) {
    const g = this.geo
    const from = g.getAttribute('aFrom') as THREE.BufferAttribute, to = g.getAttribute('aTo') as THREE.BufferAttribute
    const af = g.getAttribute('aAlphaFrom') as THREE.BufferAttribute, at = g.getAttribute('aAlphaTo') as THREE.BufferAttribute
    const hot = g.getAttribute('aHot') as THREE.BufferAttribute
    const u = this.mat.uniforms
    // Freeze the current look as the new start. Close enough mid-flight, and the arc hides the jump.
    const prevAnchor = u.uAnchorTo.value, prevOff = u.uOffTo.value
    from.array.set(to.array); af.array.set(at.array)
    u.uOffFrom.value = prevOff; u.uAnchorFrom.value = prevAnchor
    to.array.set(s.pos); at.array.set(s.alpha)
    hot.array.set(s.hot ?? new Float32Array(this.n))
    from.needsUpdate = to.needsUpdate = af.needsUpdate = at.needsUpdate = hot.needsUpdate = true
    u.uAnchorTo.value = s.anchored ? 1 : 0
    u.uWorldFrom.value = u.uWorldTo.value
    u.uWorldTo.value = s.world ? 1 : 0
    if (s.world) { const w = g.getAttribute('aWorld') as THREE.BufferAttribute; w.array.set(s.world); w.needsUpdate = true }
    this.anchorY = s.anchorY ?? 0
    this.current = s
    this.sizeTarget = s.size ?? 2.6
    if (dur <= 0 || calm()) { u.uMix.value = 1; this.mixDur = 0; u.uSize.value = this.sizeTarget; return }
    u.uMix.value = 0
    this.mixStart = performance.now(); this.mixDur = dur * 1000
  }
  private anchorY = 0

  /** Nearest light to a viewport point, or -1. */
  pick(x: number, y: number, radius = 14) {
    const s = this.current
    if (!s) return -1
    const off = s.anchored ? this.scrollY - this.anchorY : 0
    let best = -1, bd = radius * radius
    const e = this.pitch.vp.elements
    for (let i = 0; i < this.n; i++) {
      if (s.alpha[i] < 0.3) continue
      let px = s.pos[i * 2], py = s.pos[i * 2 + 1] - off
      if (s.world) {
        const a = s.world[i * 3], b = s.world[i * 3 + 1], c = s.world[i * 3 + 2]
        const w = e[3] * a + e[7] * b + e[11] * c + e[15]
        const pn = this.panels[i < this.n - this.nM ? 0 : 1]
        px = pn[0] + ((e[0] * a + e[4] * b + e[8] * c + e[12]) / w * 0.5 + 0.5) * pn[2]
        py = pn[1] + (0.5 - (e[1] * a + e[5] * b + e[9] * c + e[13]) / w * 0.5) * pn[3]
      }
      const dx = px - x, dy = py - y
      const d = dx * dx + dy * dy
      if (d < bd) { bd = d; best = i }
    }
    return best
  }

  private loop(t: number) {
    this.raf = requestAnimationFrame(this.loop)
    const u = this.mat.uniforms
    u.uTime.value = (t - this.start) / 1000
    if (this.mixDur) {
      const k = Math.min(1, (t - this.mixStart) / this.mixDur)
      u.uMix.value = k
      if (k === 1) this.mixDur = 0
    }
    u.uSize.value += (this.sizeTarget - u.uSize.value) * 0.08
    if (u.uShock.value.z < 1) u.uShock.value.z = Math.min(1, (t - this.shockT) / 1500)
    this.pitch.update(u.uTime.value)
    this.scrollY = window.scrollY
    u.uOffTo.value = this.scrollY - this.anchorY
    this.renderer.clear()
    if (this.pitch.visible && this.panels.length) {
      const gl = this.renderer, H = u.uRes.value.y
      gl.setScissorTest(true)
      this.panels.forEach(([x, y, w, h], i) => {
        gl.setViewport(x, H - y - h, w, h); gl.setScissor(x, H - y - h, w, h)
        this.pitch.setWho(i === 0 ? 1 : 0, i === 0 ? 0 : 1)
        gl.render(this.pitch.scene, this.pitch.camera)
      })
      gl.setScissorTest(false)
      gl.setViewport(0, 0, u.uRes.value.x, H)
    }
    this.renderer.render(this.scene, this.cam)
  }

  dispose() { cancelAnimationFrame(this.raf); this.renderer.dispose(); this.geo.dispose(); this.mat.dispose() }
}
