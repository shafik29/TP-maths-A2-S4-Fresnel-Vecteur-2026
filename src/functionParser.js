export class FunctionParser {
  static parse(input) {
    try {
      const cleanedInput = input.replace(/\s+/g, '').toLowerCase()

      const sinPattern = /^([+-]?\d*\.?\d*)\*?sin\(([+-]?\d*\.?\d*)\*?t([+-][^)]+)?\)$/
      const match = cleanedInput.match(sinPattern)

      if (!match) {
        return {
          success: false,
          error: 'Format invalide. Utilisez le format : a*sin(ω*t + φ)'
        }
      }

      let amplitude = match[1] ? parseFloat(match[1]) : 1
      if (match[1] === '-') amplitude = -1
      if (match[1] === '+' || match[1] === '') amplitude = 1

      let pulsation = match[2] ? parseFloat(match[2]) : 1
      if (match[2] === '-') pulsation = -1
      if (match[2] === '+' || match[2] === '') pulsation = 1

      let phase = 0
      if (match[3]) {
        phase = this.evaluatePhase(match[3])
      }

      if (isNaN(amplitude) || isNaN(pulsation) || isNaN(phase)) {
        return {
          success: false,
          error: 'Valeurs numériques invalides'
        }
      }

      if (Math.abs(amplitude) > 20) {
        return {
          success: false,
          error: 'L\'amplitude doit être inférieure à 20'
        }
      }

      if (Math.abs(pulsation) > 1000) {
        return {
          success: false,
          error: 'La pulsation doit être inférieure à 1000 rad/s'
        }
      }

      return {
        success: true,
        amplitude: Math.abs(amplitude),
        pulsation: Math.abs(pulsation),
        phase: phase
      }

    } catch (error) {
      return {
        success: false,
        error: 'Erreur lors de l\'analyse de la fonction'
      }
    }
  }

  static evaluatePhase(phaseStr) {
    phaseStr = phaseStr.replace(/\s+/g, '')

    let sign = 1
    if (phaseStr.startsWith('+')) {
      phaseStr = phaseStr.substring(1)
    } else if (phaseStr.startsWith('-')) {
      sign = -1
      phaseStr = phaseStr.substring(1)
    }

    phaseStr = phaseStr.replace(/pi/g, 'π')

    const piPattern = /^(\d*\.?\d*)\*?π\/(\d+\.?\d*)$/
    const piMatch = phaseStr.match(piPattern)
    if (piMatch) {
      const numerator = piMatch[1] ? parseFloat(piMatch[1]) : 1
      const denominator = parseFloat(piMatch[2])
      return sign * (numerator * Math.PI / denominator)
    }

    const simplePiPattern = /^(\d*\.?\d*)\*?π$/
    const simplePiMatch = phaseStr.match(simplePiPattern)
    if (simplePiMatch) {
      const coefficient = simplePiMatch[1] ? parseFloat(simplePiMatch[1]) : 1
      return sign * coefficient * Math.PI
    }

    const numericValue = parseFloat(phaseStr)
    if (!isNaN(numericValue)) {
      return sign * numericValue
    }

    return NaN
  }

  static formatFunction(amplitude, pulsation, phase) {
    let phaseStr = ''
    if (Math.abs(phase) > 0.001) {
      const phaseFormatted = this.formatPhaseWithPi(phase)
      if (phase > 0) {
        phaseStr = ` + ${phaseFormatted}`
      } else {
        phaseStr = ` - ${phaseFormatted.replace('-', '')}`
      }
    }

    return `i(t) = ${amplitude} sin(${pulsation}t${phaseStr})`
  }

  static formatPhaseWithPi(phase) {
    const tolerance = 0.01
    const piRatios = [
      { num: 0, den: 1, label: '0' },
      { num: 1, den: 12, label: 'π/12' },
      { num: 1, den: 6, label: 'π/6' },
      { num: 1, den: 4, label: 'π/4' },
      { num: 1, den: 3, label: 'π/3' },
      { num: 5, den: 12, label: '5π/12' },
      { num: 1, den: 2, label: 'π/2' },
      { num: 7, den: 12, label: '7π/12' },
      { num: 2, den: 3, label: '2π/3' },
      { num: 3, den: 4, label: '3π/4' },
      { num: 5, den: 6, label: '5π/6' },
      { num: 11, den: 12, label: '11π/12' },
      { num: 1, den: 1, label: 'π' },
      { num: 13, den: 12, label: '13π/12' },
      { num: 7, den: 6, label: '7π/6' },
      { num: 5, den: 4, label: '5π/4' },
      { num: 4, den: 3, label: '4π/3' },
      { num: 17, den: 12, label: '17π/12' },
      { num: 3, den: 2, label: '3π/2' },
      { num: 19, den: 12, label: '19π/12' },
      { num: 5, den: 3, label: '5π/3' },
      { num: 7, den: 4, label: '7π/4' },
      { num: 11, den: 6, label: '11π/6' },
      { num: 23, den: 12, label: '23π/12' },
      { num: 2, den: 1, label: '2π' }
    ]

    const absPhase = Math.abs(phase)
    const sign = phase < 0 ? '-' : ''

    for (const ratio of piRatios) {
      const value = (ratio.num / ratio.den) * Math.PI
      if (Math.abs(absPhase - value) < tolerance) {
        return ratio.label === '0' ? '0' : `${sign}${ratio.label}`
      }
    }

    return phase.toFixed(2)
  }
}
