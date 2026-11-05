import * as THREE from 'three'

/** Half a pitch in world metres: goal line at z = 0, +z towards halfway, y up, x across. */
const W = 34, L = 52.5

const seg = (out: number[], ...p: number[]) => { for (let i = 0; i + 3 < p.length; i += 2) out.push(p[i], 0.02, p[i + 1], p[i + 2], 0.02, p[i + 3]) }
const rect = (out: number[], x: number, z: number) => seg(out, -x, 0, -x, z, x, z, x, 0)

function lines() {
  const v: number[] = []
  seg(v, -W, 0, W, 0); seg(v, -W, 0, -W, L, W, L, W, 0)
  rect(v, 20.16, 16.5); rect(v, 9.16, 5.5)
  const arc = 9.15, spot = 11, n = 30
  const start = Math.acos(5.5 / arc)
  for (let i = 0; i < n; i++) {
    const a = -start + (2 * start * i) / n, b = -start + (2 * start * (i + 1)) / n
    seg(v, Math.sin(a) * arc, spot + Math.cos(a) * arc, Math.sin(b) * arc, spot + Math.cos(b) * arc)
  }
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (Math.PI * i) / n, b = -Math.PI / 2 + (Math.PI * (i + 1)) / n
    seg(v, Math.sin(a) * arc, L - Math.cos(a) * arc, Math.sin(b) * arc, L - Math.cos(b) * arc)
  }
  seg(v, -0.2, spot, 0.2, spot)
  const g = 3.66, h = 2.44, d = 2
  const push = (a: number[], b: number[]) => v.push(...a, ...b)
  push([-g, 0, 0], [-g, h, 0]); push([g, 0, 0], [g, h, 0]); push([-g, h, 0], [g, h, 0])
  push([-g, h, 0], [-g, 0, -d]); push([g, h, 0], [g, 0, -d]); push([-g, 0, -d], [g, 0, -d])
  for (let x = -g + 0.73; x < g; x += 0.73) push([x, h, 0], [x, 0, -d])
  return new Float32Array(v)
}

export interface ShotRow { x: number; y: number; h: number; goal: boolean; type: number; who: number; seed: number }

export class Pitch {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400)
  vp = new THREE.Matrix4()
  private uni = { uAlpha: { value: 0 }, uDraw: { value: 0 }, uWho: { value: new THREE.Vector2(1, 1) }, uType: { value: new THREE.Vector4(1, 1, 1, 1) }, uDpr: { value: 1 }, uTime: { value: 0 } }
  private alphaTarget = 0
  private drawTarget = 0
  private orbitNow = 0
  orbitTarget = 0
  private aspect = 1

  constructor(rows: ShotRow[]) {
    const stripes = new THREE.Mesh(
      new THREE.PlaneGeometry(W * 2 + 8, L + 8).rotateX(-Math.PI / 2).translate(0, -0.02, L / 2 - 1),
      new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: this.uni,
        vertexShader: 'varying vec2 vP; void main(){ vP = position.xz; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
        fragmentShader: `uniform float uAlpha; varying vec2 vP;
          void main(){ float s = smoothstep(.46,.54,abs(fract(vP.y/11.)-.5)*2.); float glow = smoothstep(46.,4.,length(vP-vec2(0.,12.)));
            vec3 c = mix(vec3(.012,.1,.062), vec3(.018,.13,.08), s) * (.55 + glow * 1.5); gl_FragColor = vec4(c, uAlpha*(.25+.75*glow)); }`,
      }),
    )
    this.scene.add(stripes)

    const lineGeo = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(lines(), 3))
    this.scene.add(new THREE.LineSegments(lineGeo, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: this.uni,
      vertexShader: 'void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: 'uniform float uAlpha; void main(){ gl_FragColor = vec4(.85,1.,.9,uAlpha*.62); }',
    })))

    // missed shots: small and dim, so the goals read as the event
    const miss = rows.filter((r) => !r.goal)
    const mp = new Float32Array(miss.length * 3), mw = new Float32Array(miss.length), mt = new Float32Array(miss.length)
    miss.forEach((r, i) => { mp.set([r.x, r.h, r.y], i * 3); mw[i] = r.who; mt[i] = r.type })
    const mg = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(mp, 3)).setAttribute('aWho', new THREE.BufferAttribute(mw, 1)).setAttribute('aType', new THREE.BufferAttribute(mt, 1))
    const pts = new THREE.Points(mg, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: this.uni,
      vertexShader: `attribute float aWho; attribute float aType; uniform vec2 uWho; uniform vec4 uType; uniform float uDpr; varying float vA; varying float vW;
        void main(){ vW=aWho; vA = (aWho<.5?uWho.x:uWho.y) * uType[int(aType)]; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); gl_PointSize = 2.4*uDpr; }`,
      fragmentShader: `uniform float uAlpha; varying float vA; varying float vW; void main(){ if(vA<.01||length(gl_PointCoord-.5)>.5) discard; gl_FragColor = vec4(mix(vec3(1.,.75,.2),vec3(.45,.82,1.),vW), uAlpha*.2*vA); }`,
    }))
    pts.frustumCulled = false
    this.scene.add(pts)

    // goals: a flight path from the spot into the net
    const goals = rows.filter((r) => r.goal)
    const STEPS = 22
    const pos = new Float32Array(goals.length * STEPS * 2 * 3), t = new Float32Array(goals.length * STEPS * 2), who = new Float32Array(t.length), type = new Float32Array(t.length)
    let k = 0
    goals.forEach((r) => {
      const gx = (r.seed - 0.5) * 6.6, gy = 0.25 + ((r.seed * 7.3) % 1) * 1.95
      const dist = Math.hypot(r.x - gx, r.y), lift = r.type === 2 ? 0.4 : Math.min(2.8, dist * 0.09)
      const at = (u: number) => [r.x + (gx - r.x) * u, r.h + (gy - r.h) * u + 4 * lift * u * (1 - u), r.y * (1 - u)]
      for (let i = 0; i < STEPS; i++) {
        for (const u of [i / STEPS, (i + 1) / STEPS]) { pos.set(at(u), k * 3); t[k] = u; who[k] = r.who; type[k] = r.type; k++ }
      }
    })
    const ag = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)).setAttribute('aT', new THREE.BufferAttribute(t, 1)).setAttribute('aWho', new THREE.BufferAttribute(who, 1)).setAttribute('aType', new THREE.BufferAttribute(type, 1))
    const arcs = new THREE.LineSegments(ag, new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: this.uni,
      vertexShader: `attribute float aT; attribute float aWho; attribute float aType; uniform vec2 uWho; uniform vec4 uType; varying float vT; varying float vA; varying float vW;
        void main(){ vT=aT; vW=aWho; vA=(aWho<.5?uWho.x:uWho.y)*uType[int(aType)]; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uAlpha; uniform float uDraw; uniform float uTime; varying float vT; varying float vA; varying float vW;
        void main(){ if(vT>uDraw||vA<.01) discard; float run = .4+.6*smoothstep(.0,.15,fract(vT*1.2-uTime*.6));
          gl_FragColor = vec4(mix(vec3(1.,.75,.2),vec3(.45,.82,1.),vW), uAlpha*.34*vA*run); }`,
    }))
    arcs.frustumCulled = false
    this.scene.add(arcs)
  }

  setSize(_w: number, _h: number, dpr: number) { this.uni.uDpr.value = dpr }
  setAspect(a: number) { this.aspect = a; this.camera.aspect = a; this.camera.updateProjectionMatrix() }
  show(on: boolean) { this.alphaTarget = on ? 1 : 0 }
  draw(on: boolean) { this.drawTarget = on ? 1 : 0 }
  setWho(r: number, m: number) { this.uni.uWho.value.set(r, m) }
  setType(v: [number, number, number, number]) { this.uni.uType.value.set(...v) }
  get visible() { return this.uni.uAlpha.value > 0.004 }

  /** 0 overhead, 1 from the penalty spot end, 2 low behind the goal, 3 low from the left wing */
  private cam(o: number) {
    const k: [number, number, number, number, number, number][] = [
      [0, 52, 21, 0, 0, 19], [0, 21, 39, 0, 0, 10], [0, 5.5, -10, 0, 1.2, 17], [-30, 8, 16, 0, 1, 10],
    ]
    const i = Math.min(k.length - 2, Math.floor(o)), f = Math.min(1, o - i), e = f * f * (3 - 2 * f)
    const pull = this.aspect < 1 ? 1 + (1 - this.aspect) * 1.25 : 1
    const a = k[i], b = k[i + 1]
    const m = (n: number) => a[n] + (b[n] - a[n]) * e
    this.camera.position.set(m(0) * pull, m(1) * pull, m(2) * (m(2) > 0 ? pull : 1))
    this.camera.lookAt(m(3), m(4), m(5))
  }

  update(time: number) {
    const u = this.uni
    u.uTime.value = time
    u.uAlpha.value += (this.alphaTarget - u.uAlpha.value) * 0.08
    u.uDraw.value += (this.drawTarget - u.uDraw.value) * 0.04
    this.orbitNow += (this.orbitTarget - this.orbitNow) * 0.05
    this.cam(this.orbitNow)
    this.camera.updateMatrixWorld()
    this.vp.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse)
  }
}
