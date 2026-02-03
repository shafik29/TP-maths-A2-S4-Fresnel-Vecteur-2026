export class TemporalGraph {
  constructor() {
    this.canvas = document.getElementById('temporal-graph')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.padding = 50
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw(signals, currentTime) {
    this.clear()
    if (signals.length === 0) return

    const maxAmplitude = Math.max(...signals.map(s => s.params.amplitude), 5)
    const period = signals[0].params.getPeriod()

    this.drawAxes(maxAmplitude, period)

    signals.forEach(signal => {
      this.drawCurve(signal.params, signal.color, maxAmplitude, period)
      this.drawCurrentPoint(signal.params, signal.color, currentTime, maxAmplitude, period)
    })
  }

  drawAxes(maxAmplitude, period) {
    const ctx = this.ctx

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    const centerY = this.height / 2

    ctx.beginPath()
    ctx.moveTo(this.padding, this.padding)
    ctx.lineTo(this.padding, this.height - this.padding)
    ctx.lineTo(this.width - this.padding, this.height - this.padding)
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'

    ctx.fillText('t (s)', this.width - this.padding + 20, this.height - this.padding + 5)
    ctx.save()
    ctx.translate(15, centerY)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('i (A)', 0, 0)
    ctx.restore()

    ctx.textAlign = 'right'
    ctx.fillText(maxAmplitude.toFixed(1), this.padding - 10, this.padding + 5)
    ctx.fillText('0', this.padding - 10, centerY + 5)
    ctx.fillText((-maxAmplitude).toFixed(1), this.padding - 10, this.height - this.padding + 5)

    if (period > 0) {
      ctx.textAlign = 'center'
      const timeScale = (this.width - 2 * this.padding) / (3 * period)
      for (let i = 0; i <= 3; i++) {
        const x = this.padding + i * period * timeScale
        if (x <= this.width - this.padding) {
          const timeValue = (i * period).toFixed(4)
          ctx.fillText(timeValue, x, this.height - this.padding + 25)
          ctx.strokeStyle = '#e0e0e0'
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(x, this.padding)
          ctx.lineTo(x, this.height - this.padding)
          ctx.stroke()
        }
      }
    }
  }

  drawCurve(signalParams, color, maxAmplitude, period) {
    const ctx = this.ctx
    const centerY = this.height / 2
    const yScale = (this.height - 2 * this.padding) / (2 * maxAmplitude)
    const timeScale = (this.width - 2 * this.padding) / (3 * period || 0.1)

    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()

    const steps = 600
    const maxTime = 3 * period || 0.1

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * maxTime
      const value = signalParams.getValue(t)
      const x = this.padding + t * timeScale
      const y = centerY - value * yScale

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()
  }

  drawCurrentPoint(signalParams, color, currentTime, maxAmplitude, period) {
    const ctx = this.ctx
    const centerY = this.height / 2
    const yScale = (this.height - 2 * this.padding) / (2 * maxAmplitude)
    const timeScale = (this.width - 2 * this.padding) / (3 * period || 0.1)

    const value = signalParams.getValue(currentTime)
    const x = this.padding + currentTime * timeScale
    const y = centerY - value * yScale

    if (x >= this.padding && x <= this.width - this.padding) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(x, y, 7, 0, 2 * Math.PI)
      ctx.fill()

      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, this.height - this.padding)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
}
