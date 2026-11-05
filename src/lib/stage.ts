import { GoalField, type Shape } from './field'
import { sky } from './shapes'

/** Decides which shape the lights hold, based on which chapter is on screen. */
class Stage {
  field: GoalField | null = null
  private active: { key: string; make: () => Shape }[] = []
  private idle: Shape | null = null

  attach(f: GoalField) {
    this.field = f
    this.idle = sky()
    f.go(this.idle, 0)
    this.sync(0.01)
    addEventListener('resize', this.onResize)
  }
  private width = innerWidth
  private onResize = () => {
    // Phone URL bars fire resize on scroll. The canvas is 100lvh, so only width changes matter there.
    if (innerWidth === this.width && matchMedia('(pointer: coarse)').matches) return
    this.width = innerWidth
    this.field?.resize()
    this.idle = sky()
    clearTimeout(this.t)
    this.t = window.setTimeout(() => this.sync(0.5), 180)
  }
  private t = 0

  enter(key: string, make: () => Shape, dur?: number) {
    this.active = this.active.filter((a) => a.key !== key)
    this.active.push({ key, make })
    this.sync(dur)
  }
  leave(key: string) {
    const top = this.active[this.active.length - 1]
    this.active = this.active.filter((a) => a.key !== key)
    if (top?.key === key) this.sync()
  }
  /** Rebuild the on-screen shape, for example after a toggle. */
  refresh(key: string, make: () => Shape, dur?: number) {
    const a = this.active.find((x) => x.key === key)
    if (a) { a.make = make; if (this.active[this.active.length - 1] === a) this.sync(dur) }
  }
  private sync(dur = 1.5) {
    const f = this.field
    if (!f) return
    const top = this.active[this.active.length - 1]
    f.go(top ? top.make() : this.idle!, dur)
  }
}
export const stage = new Stage()
