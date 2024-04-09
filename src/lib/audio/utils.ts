export function drawSignal(
    canvas: HTMLCanvasElement,
    signal: Float32Array,
    drawFreq: number = 400,
    F: number = 48000,
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // console.time('draw-scope')

    const w = canvas.width
    const h = canvas.height
    const numSamplesToDraw = (F / drawFreq) * 2

    if (numSamplesToDraw * 2 > signal.length) {
        console.warn('not enough sample for canvas', canvas)
    }

    // background
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, w, h)

    // find the first index in signal that triggers the scope (raise, trieggerY)
    let triggerIndex = 0
    let soundDetected = false
    const backOffeset = 5
    const noiseMarginY = 0.01
    const triggerLevelY = signal.reduce((prev, curr) => Math.max(prev, curr)) - noiseMarginY

    for (let i = backOffeset; i < signal.length - numSamplesToDraw - 1; i++) {
        const y2 = signal[i]
        const y1 = signal[i - backOffeset]

        if (y1 < triggerLevelY && y2 > triggerLevelY) {
            triggerIndex = i
            break
        }

        // check if something is played
        if (y2 > noiseMarginY) soundDetected = true
    }

    if (soundDetected && triggerIndex === 0) console.warn('no trigger for scope', canvas)

    // draw line, a small square for each sample to draw
    ctx.fillStyle = 'white'
    for (let i = 0; i < numSamplesToDraw; ++i) {
        const canvasX = i * (w / numSamplesToDraw)
        const y = signal[triggerIndex + i]
        const canvasY = h / 2 - (y * h) / 2
        ctx.fillRect(canvasX, canvasY, 2, 2)
    }
    // console.timeEnd('draw-scope')
}

export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max)
}
