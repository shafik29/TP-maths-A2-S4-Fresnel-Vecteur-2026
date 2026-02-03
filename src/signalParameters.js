export class SignalParameters {
  constructor(amplitude = 2.0, pulsation = 100, phase = 0) {
    this.amplitude = amplitude
    this.pulsation = pulsation
    this.phase = phase
  }

  getValue(time) {
    return this.amplitude * Math.sin(this.pulsation * time + this.phase)
  }

  getPeriod() {
    if (this.pulsation === 0) return 0
    return (2 * Math.PI) / this.pulsation
  }
}
