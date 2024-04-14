import * as Tone from 'tone'

export default class TriphaseAnalyzer {
    readonly getValue: () => {
        rms: number[]
        waveform: Float32Array[]
    }

    readonly dispose: () => void

    readonly input: Tone.Gain<'gain'>

    constructor(public readonly context: Tone.Context = Tone.getContext() as any) {
        const input = new Tone.Gain({ context, gain: 1 })

        const split = new Tone.Split({ context, channels: 2 })
        input.connect(split)
        console.log(
            split.channelCount,
            split.numberOfOutputs,
            split.channelCountMode,
            split.numberOfInputs,
        )

        const diff = new Tone.Subtract({ context })
        split.connect(diff, 0, 0)
        split.connect(diff.subtrahend, 1, 0)

        const smoothing = 0.99
        const meterL = new Tone.Meter({ context, normalRange: true, smoothing })
        split.connect(meterL, 0, 0)
        const meterR = new Tone.Meter({ context, normalRange: true, smoothing })
        split.connect(meterR, 1, 0)
        const meterDiff = new Tone.Meter({ context, normalRange: true, smoothing })
        diff.connect(meterDiff)

        const size = 2048 * 2
        const analyzer = new Tone.Analyser({ context, type: 'waveform', channels: 2, size })
        input.connect(analyzer)

        this.getValue = () => {
            return {
                waveform: analyzer.getValue() as Float32Array[],
                rms: [
                    meterL.getValue() as number,
                    meterR.getValue() as number,
                    meterDiff.getValue() as number,
                ],
            }
        }

        this.dispose = () => {}
        this.input = input
    }
}
