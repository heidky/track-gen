<script lang="ts">
    import { drawSignal } from '$lib/audio/utils'
    import * as Tone from 'tone'

    let { node } = $props()
    let canvas: HTMLCanvasElement
    let analyzer: Tone.Analyser

    $effect(() => {
        console.log('creating Tone.Analyzer instance')
        analyzer = new Tone.Analyser({ type: 'waveform', size: 2048 * 2 })
        ;(node as any).connect(analyzer)
        return () => analyzer.dispose()
    })

    $effect(() => {
        // console.log(1 / analyzer.sampleTime)
        const interval = setInterval(() => {
            drawSignal(canvas, analyzer.getValue() as Float32Array, 50)
        }, 1000 / 10)
        return () => clearInterval(interval)
    })
</script>

<canvas width="400" height="200" bind:this={canvas} />
