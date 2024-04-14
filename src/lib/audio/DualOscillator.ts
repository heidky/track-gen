import * as Tone from 'tone'
import { clamp } from './utils'

const NORMALIZATION = 0.707

const defaultConfig = {
    volume: 0.5,
    carrierFreq: 800,
    carrierFreqDelta: 0,
    carrierPhaseDelta: 0,
    normalization: NORMALIZATION, // 0.707 => -3db
    pulseFreq: 50,
    pulseSquish: 1,
}

export function getDefaultConfig() {
    return { ...defaultConfig }
}

export type DualOscillatorConfig = typeof defaultConfig

export default class DualOscillator {
    readonly output: Tone.Gain<'gain'>
    readonly oscillatorL: Tone.Oscillator
    readonly oscillatorR: Tone.Oscillator
    readonly pulseOscillator: Tone.Oscillator
    readonly volumeGain: Tone.Gain<'gain'>
    readonly pulseSquish: Tone.Signal

    private _config: DualOscillatorConfig = defaultConfig

    public onState?: (isPlaying: boolean) => void
    public rampTime = 5

    constructor(public readonly context: Tone.Context = Tone.getContext() as any) {
        const config = this.config

        const output = new Tone.Gain({ context, gain: 0 })
        const volumeGain = new Tone.Gain({ context, gain: config.volume })
        const normGain = new Tone.Gain({ context, gain: config.normalization })
        const amGain = new Tone.Gain({ context, gain: 0 })

        const oscillatorL = new Tone.Oscillator({
            context,
            type: 'sine',
            frequency: config.carrierFreq,
        })
        const oscillatorR = new Tone.Oscillator({
            context,
            type: 'sine',
            frequency: config.carrierFreq + config.carrierFreqDelta,
            phase: config.carrierPhaseDelta,
        })

        const oscillators = new Tone.Merge()
        oscillatorL.connect(oscillators, 0, 0)
        oscillatorR.connect(oscillators, 0, 1)

        oscillators.chain(amGain, normGain, volumeGain, output)

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
        this.oscillatorL = oscillatorL
        this.oscillatorR = oscillatorR
        this.pulseOscillator = pOscillator
        this.pulseSquish = pSquish
    }

    start() {
        const now = Tone.now()
        this.oscillatorL.start(now)
        this.oscillatorR.start(now)
        this.pulseOscillator.start(now)
        this.output.gain.linearRampTo(1, this.rampTime, now)
        this.onState?.(true)
    }

    stop() {
        const now = Tone.now()
        this.oscillatorL.stop(now)
        this.oscillatorR.stop(now)
        this.pulseOscillator.stop(now)
        this.output.gain.value = 0
        this.onState?.(false)
    }

    set config(config: DualOscillatorConfig) {
        this._config = DualOscillator.sanitazieConfig(config)

        this.volumeGain.gain.value = this._config.volume

        this.oscillatorL.frequency.value = this._config.carrierFreq
        this.oscillatorR.frequency.value = this._config.carrierFreq + this._config.carrierFreqDelta
        this.oscillatorR.phase = this._config.carrierPhaseDelta

        this.pulseOscillator.frequency.value = this._config.pulseFreq
        this.pulseSquish.value = this._config.pulseSquish
    }

    get config(): DualOscillatorConfig {
        return { ...this._config }
    }

    static sanitazieConfig(config: DualOscillatorConfig) {
        const c = { ...config }

        c.volume = clamp(c.volume, 0, 1)
        c.normalization = NORMALIZATION // force to be constant, will change in the future
        if (c.normalization < 0 || c.normalization > 1) {
            c.normalization = 0
            console.error('wrong normalization value')
        }

        c.carrierFreq = clamp(c.carrierFreq, 50, 1000)
        c.carrierFreqDelta = clamp(c.carrierFreqDelta, -50, 50)
        c.carrierPhaseDelta = clamp(c.carrierPhaseDelta, -180, 180)

        c.pulseFreq = clamp(c.pulseFreq, 1, 150)
        c.pulseSquish = clamp(c.pulseSquish, 0, 5)
        return c
    }

    static get defaultConfig() {
        return structuredClone(defaultConfig)
    }
}
