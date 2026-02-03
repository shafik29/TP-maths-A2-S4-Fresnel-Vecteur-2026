export class FresnelDiagram {
  constructor() {
    this.canvas = document.getElementById('fresnel-diagram')
    this.ctx = this.canvas.getContext('2d')
    this.width = this.canvas.width
    this.height = this.canvas.height
    this.centerX = this.width / 2
    this.centerY = this.height / 2
    this.scale = 50
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw(signals, currentTime) {
    this.clear()
    if (signals.length === 0) return

    this.drawAxes()

    signals.forEach(signal => {
      this.drawCircle(signal.params, signal.color)
      this.drawVector(signal.params, signal.color, currentTime)
    })
  }

  drawAxes() {
    const ctx = this.ctx

    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2

    ctx.beginPath()
    ctx.moveTo(50, this.centerY)
    ctx.lineTo(this.width - 50, this.centerY)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(this.centerX, 50)
    ctx.lineTo(this.centerX, this.height - 50)
    ctx.stroke()

    ctx.fillStyle = '#333'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Origine des phases', this.width - 60, this.centerY - 15)

    ctx.save()
    ctx.translate(this.centerX + 20, 40)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Axe imaginaire', 0, 0)
    ctx.restore()

    ctx.beginPath()
    ctx.moveTo(this.width - 50, this.centerY)
    ctx.lineTo(this.width - 60, this.centerY - 5)
    ctx.moveTo(this.width - 50, this.centerY)
    ctx.lineTo(this.width - 60, this.centerY + 5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(this.centerX, 50)
    ctx.lineTo(this.centerX - 5, 60)
    ctx.moveTo(this.centerX, 50)
    ctx.lineTo(this.centerX + 5, 60)
    ctx.stroke()
  }

  drawCircle(signalParams, color) {
    const ctx = this.ctx
    const radius = signalParams.amplitude * this.scale

    ctx.strokeStyle = color
    ctx.globalAlpha = 0.3
    ctx.lineWidth = 1
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.arc(this.centerX, this.centerY, radius, 0, 2 * Math.PI)
    ctx.stroke()
    ctx.setLineDash([])
    ctx.globalAlpha = 1.0
  }

  drawVector(signalParams, color, currentTime) {
    const ctx = this.ctx
    const amplitude = signalParams.amplitude
    const phase = signalParams.phase
    const omega = signalParams.pulsation

    const currentAngle = omega * currentTime + phase

    const endX = this.centerX + amplitude * this.scale * Math.cos(currentAngle)
    const endY = this.centerY - amplitude * this.scale * Math.sin(currentAngle)

    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(this.centerX, this.centerY)
    ctx.lineTo(endX, endY)
    ctx.stroke()

    const arrowLength = 15
    const arrowAngle = Math.PI / 6
    const angle = Math.atan2(endY - this.centerY, endX - this.centerX)

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(endX, endY)
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    )
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    )
    ctx.closePath()
    ctx.fill()

    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(endX, endY, 6, 0, 2 * Math.PI)
    ctx.fill()
  }
}
