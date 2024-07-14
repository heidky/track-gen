<script lang="ts">
    import { drawSignal } from './scope'
    import * as Tone from 'tone'

    const FPS = 30
    const VIEW_FREQ = 50
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
        const interval = setInterval(() => {
            drawSignal(canvas, analyzer.getValue() as Float32Array, VIEW_FREQ)
        }, 1000 / FPS)
        return () => clearInterval(interval)
    })
</script>

<canvas class="flex overflow-hidden rounded-md" width="400" height="200" bind:this={canvas}
></canvas>
