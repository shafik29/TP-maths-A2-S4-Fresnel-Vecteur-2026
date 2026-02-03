export class AnimationController {
  constructor(signals, temporalGraph, fresnelDiagram) {
    this.signals = signals
    this.temporalGraph = temporalGraph
    this.fresnelDiagram = fresnelDiagram

    this.isAnimating = false
    this.currentTime = 0
    this.animationSpeed = 0.0005
    this.animationId = null
  }

  toggle() {
    this.isAnimating = !this.isAnimating

    if (this.isAnimating) {
      this.animate()
    } else {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId)
        this.animationId = null
      }
    }

    return this.isAnimating
  }

  reset() {
    this.currentTime = 0
    if (!this.isAnimating) {
      const event = new Event('render')
      window.dispatchEvent(event)
    }
  }

  animate() {
    if (!this.isAnimating) return

    this.currentTime += this.animationSpeed

    const period = this.signals[0].getPeriod()
    if (period > 0 && this.currentTime > 3 * period) {
      this.currentTime = 0
    }

    const event = new Event('render')
    window.dispatchEvent(event)

    this.animationId = requestAnimationFrame(() => this.animate())
  }
}
