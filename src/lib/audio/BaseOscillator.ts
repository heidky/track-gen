import * as Tone from 'tone'

export default class BaseOscillator {
    // readonly osc: Tone.Oscillator
    readonly output: Tone.Gain<'gain'>
    readonly oscillator: Tone.Oscillator
    readonly pulseOscillator: Tone.Oscillator
    public onState?: (isPlaying: boolean) => void
    public rampTime = 5

    constructor(public readonly context: Tone.Context = Tone.getContext() as any) {
        const volume = 0.5
        const normalization = 0.95
        const freq = 700
        const pulseFreq = 50
        const pulseBias = 0.7 // [0, 1, 2]

        const output = new Tone.Gain({ context, gain: 0 })
        const volumeGain = new Tone.Gain({ context, gain: volume })
        const normGain = new Tone.Gain({ context, gain: normalization })
        const amGain = new Tone.Gain({ context, gain: 0 })
        const osc = new Tone.Oscillator({ context, type: 'sine', frequency: freq })
        osc.chain(amGain, normGain, volumeGain, output)

        const pOsc = new Tone.Oscillator({ context, type: 'sine', frequency: pulseFreq })
        const pD = new Tone.Signal({ context, value: 1 })

        // pOsc * pD - pD + 1 => clamp(0, +inf) => gain
        const pMult = new Tone.Multiply({ context })
        pD.connect(pMult.factor)

        const pSub = new Tone.Subtract({ context })
        pD.connect(pSub.subtrahend)

        const pAdd1 = new Tone.Add({ context, value: 1 })
        const pClamp = new Tone.WaveShaper((x) => Math.max(x, 0))

        pOsc.chain(pMult, pSub, pAdd1, pClamp, amGain.gain)

        this.output = output
        this.oscillator = osc
        this.pulseOscillator = pOsc
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
