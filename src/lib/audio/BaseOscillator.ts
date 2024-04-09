import * as Tone from 'tone'
import { clamp } from './utils'

const defaultConfig = {
    carrierFreq: 400,
    normalization: 0.95,
    pulseFreq: 50,
    pulseSquish: 1,
}

export type BaseConfig = typeof defaultConfig

export default class BaseOscillator {
    readonly output: Tone.Gain<'gain'>
    readonly oscillator: Tone.Oscillator
    readonly pulseOscillator: Tone.Oscillator
    readonly volumeGain: Tone.Gain<'gain'>
    readonly pulseSquish: Tone.Signal

    private _config: BaseConfig = defaultConfig
    public onState?: (isPlaying: boolean) => void
    public rampTime = 5

    constructor(public readonly context: Tone.Context = Tone.getContext() as any) {
        const volume = 1
        const config = this.config

        const output = new Tone.Gain({ context, gain: 0 })
        const volumeGain = new Tone.Gain({ context, gain: volume })
        const normGain = new Tone.Gain({ context, gain: config.normalization })
        const amGain = new Tone.Gain({ context, gain: 0 })
        const oscillator = new Tone.Oscillator({
            context,
            type: 'sine',
            frequency: config.carrierFreq,
        })

        oscillator.chain(amGain, normGain, volumeGain, output)

        const pOscillator = new Tone.Oscillator({
            context,
            type: 'sine',
            frequency: config.pulseFreq,
        })
        const pSquish = new Tone.Signal({ context, value: config.pulseSquish })

        // pOscillator * pSquish - pSquish + 1 => max(x, 0) => gain
        const pMult = new Tone.Multiply({ context })
        pSquish.connect(pMult.factor)

        const pSub = new Tone.Subtract({ context })
        pSquish.connect(pSub.subtrahend)

        const pAdd1 = new Tone.Add({ context, value: 1 })
        const pClamp = new Tone.WaveShaper((x) => Math.max(x, 0))

        pOscillator.chain(pMult, pSub, pAdd1, pClamp, amGain.gain)

        //for later
        this.output = output
        this.volumeGain = volumeGain
        this.oscillator = oscillator
        this.pulseOscillator = pOscillator
        this.pulseSquish = pSquish
    }

    start() {
        const now = Tone.now()
        this.oscillator.start(now)
        this.pulseOscillator.start(now)
        this.output.gain.linearRampTo(1, this.rampTime, now)
        this.onState?.(true)
    }

    stop() {
        const now = Tone.now()
        this.oscillator.stop(now)
        this.pulseOscillator.stop(now)
        this.output.gain.value = 0
        this.onState?.(false)
    }

    setConfig(config: BaseConfig) {
        const c = { ...config }
        c.normalization = 0.95
        c.carrierFreq = clamp(c.carrierFreq, 50, 1000)
        c.pulseFreq = clamp(c.pulseFreq, 1, 150)
        c.pulseSquish = clamp(c.pulseSquish, 0, 5)
        this._config = c

        this.oscillator.frequency.value = c.carrierFreq
        this.pulseOscillator.frequency.value = c.pulseFreq
        this.pulseSquish.value = c.pulseSquish
    }

    get config() {
        return this._config
    }
}

// const pulseAddBias = new Tone.Add({ context })
// pulseBiasSignal.connect(pulseAddBias.addend)
// pulseOsc.connect(pulseAddBias)

// const pulseAddOne = new Tone.Add({ context, value: 1 })
// const pulsePow = new Tone.Pow({ context, value: -1 })
// pulseBiasSignal.chain(pulseAddOne, pulsePow)

// const pulseMult = new Tone.Multiply({ context, minValue: 0 })
// pulsePow.connect(pulseMult.factor)
// pulseAddBias.connect(pulseMult)

// pulseMult.connect(amGain.gain)
// osc.connect(amGain)
