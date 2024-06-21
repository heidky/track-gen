<script lang="ts">
    import TriphaseAnalyzer from '$lib/audio/TriphaseAnalyzer'
    import { drawSignal3D } from '$lib/component/scope'

    const FPS = 10
    const VIEW_FREQ = 50
    let { node } = $props()
    let canvas: HTMLCanvasElement
    let analyzer: TriphaseAnalyzer

    $effect(() => {
        console.log('creating TriphaseAnalyzer instance')
        analyzer = new TriphaseAnalyzer()
        ;(node as any).connect(analyzer.input)
        return () => analyzer.dispose()
    })

    $effect(() => {
        const interval = setInterval(() => {
            // console.time('canvas-2d')
            const v = analyzer.getValue()
            drawSignal3D(canvas, v.waveform, VIEW_FREQ)
            // console.timeEnd('canvas-2d')
        }, 1000 / FPS)
        return () => clearInterval(interval)
    })
</script>

<canvas class="flex overflow-hidden rounded-md" width="400" height="400" bind:this={canvas} />
