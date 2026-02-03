import './style.css'
import { SignalParameters } from './signalParameters.js'
import { TemporalGraph } from './temporalGraph.js'
import { FresnelDiagram } from './fresnelDiagram.js'
import { AnimationController } from './animation.js'
import { FunctionParser } from './functionParser.js'

class FresnelApp {
  constructor() {
    this.signal1 = new SignalParameters(3, 314, 5 * Math.PI / 12)
    this.signal2 = new SignalParameters(4, 314, -Math.PI / 6)
    this.customSignal = null

    this.temporalGraph = new TemporalGraph()
    this.fresnelDiagram = new FresnelDiagram()

    this.animationController = new AnimationController(
      [this.signal1, this.signal2],
      this.temporalGraph,
      this.fresnelDiagram
    )

    this.showSignal1 = false
    this.showSignal2 = false
    this.showCustomSignal = false

    this.init()
  }

  init() {
    this.setupEventListeners()
    window.addEventListener('render', () => this.render())
  }

  setupEventListeners() {
    document.getElementById('btn-signal-1').addEventListener('click', () => {
      this.showSignal1 = !this.showSignal1
      this.toggleButton('btn-signal-1', this.showSignal1)
      this.updateInfoDisplay()
      this.render()
    })

    document.getElementById('btn-signal-2').addEventListener('click', () => {
      this.showSignal2 = !this.showSignal2
      this.toggleButton('btn-signal-2', this.showSignal2)
      this.updateInfoDisplay()
      this.render()
    })

    document.getElementById('btn-animation').addEventListener('click', () => {
      const isAnimating = this.animationController.toggle()
      this.toggleButton('btn-animation', isAnimating)
      document.getElementById('btn-animation').textContent = isAnimating ? 'Arrêter l\'animation' : 'Démarrer l\'animation'
    })

    document.getElementById('btn-reset').addEventListener('click', () => {
      this.animationController.reset()
      this.render()
    })

    document.getElementById('btn-validate').addEventListener('click', () => {
      this.validateCustomFunction()
    })

    document.getElementById('custom-function').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.validateCustomFunction()
      }
    })
  }

  validateCustomFunction() {
    const input = document.getElementById('custom-function').value
    const result = FunctionParser.parse(input)
    const resultDiv = document.getElementById('validation-result')

    if (result.success) {
      this.customSignal = new SignalParameters(
        result.amplitude,
        result.pulsation,
        result.phase
      )

      this.showCustomSignal = true
      this.showSignal1 = false
      this.showSignal2 = false
      this.toggleButton('btn-signal-1', false)
      this.toggleButton('btn-signal-2', false)

      const functionStr = FunctionParser.formatFunction(
        result.amplitude,
        result.pulsation,
        result.phase
      )

      const expectedAmplitude = 4.3
      const expectedPulsation = 314
      const expectedPhase = Math.PI / 30

      const amplitudeTolerance = 0.05
      const pulsationTolerance = 1
      const phaseTolerance = 0.01

      const isCorrectAnswer =
        Math.abs(result.amplitude - expectedAmplitude) < amplitudeTolerance &&
        Math.abs(result.pulsation - expectedPulsation) < pulsationTolerance &&
        Math.abs(result.phase - expectedPhase) < phaseTolerance

      if (isCorrectAnswer) {
        resultDiv.innerHTML = `
          <div class="congratulations-message">
            <h3>🎉 Bravo !</h3>
            <p class="success-text">Vous avez correctement additionné les courants <em>i</em>₁ et <em>i</em>₂ à l'aide des vecteurs de Fresnel.</p>
            <p class="function-display">${functionStr}</p>
            <div class="parameters">
              <p><strong>Amplitude :</strong> a = ${result.amplitude.toFixed(2)} A</p>
              <p><strong>Pulsation :</strong> ω = ${result.pulsation.toFixed(2)} rad/s</p>
              <p><strong>Phase initiale :</strong> φ = ${result.phase.toFixed(4)} rad ≈ π/30</p>
            </div>
            <p class="validation-note">✓ Addition vectorielle réussie</p>
          </div>
        `
      } else {
        resultDiv.innerHTML = `
          <div class="success-message">
            <h3>✓ Fonction validée</h3>
            <p class="function-display">${functionStr}</p>
            <div class="parameters">
              <p><strong>Amplitude :</strong> a = ${result.amplitude.toFixed(2)} A</p>
              <p><strong>Pulsation :</strong> ω = ${result.pulsation.toFixed(2)} rad/s</p>
              <p><strong>Phase initiale :</strong> φ = ${result.phase.toFixed(4)} rad</p>
            </div>
            <p class="neutral-feedback">Expression incorrecte ou incomplète. Vérifiez l'amplitude et la phase.</p>
          </div>
        `
      }

      resultDiv.style.display = 'block'

      this.updateInfoDisplay()
      this.render()

    } else {
      resultDiv.innerHTML = `
        <div class="error-message">
          <h3>✗ Erreur</h3>
          <p>${result.error}</p>
          <p class="hint">Format attendu : a*sin(ω*t + φ)</p>
          <p class="hint">Exemple : 3*sin(314*t + pi/6)</p>
        </div>
      `
      resultDiv.style.display = 'block'
    }
  }

  toggleButton(buttonId, active) {
    const button = document.getElementById(buttonId)
    if (active) {
      button.classList.add('active')
    } else {
      button.classList.remove('active')
    }
  }

  updateInfoDisplay() {
    const signalInfo = document.getElementById('signal-info')
    const info1 = document.getElementById('info-signal-1')
    const info2 = document.getElementById('info-signal-2')

    if (this.showSignal1 || this.showSignal2) {
      signalInfo.style.display = 'block'
    } else {
      signalInfo.style.display = 'none'
    }

    info1.style.display = this.showSignal1 ? 'block' : 'none'
    info2.style.display = this.showSignal2 ? 'block' : 'none'
  }

  render() {
    const signals = []
    if (this.showSignal1) signals.push({ params: this.signal1, color: '#e74c3c' })
    if (this.showSignal2) signals.push({ params: this.signal2, color: '#27ae60' })
    if (this.showCustomSignal && this.customSignal) {
      signals.push({ params: this.customSignal, color: '#3498db' })
    }

    if (signals.length > 0) {
      this.temporalGraph.draw(signals, this.animationController.currentTime)
      this.fresnelDiagram.draw(signals, this.animationController.currentTime)
    } else {
      this.temporalGraph.clear()
      this.fresnelDiagram.clear()
    }
  }
}

new FresnelApp()
