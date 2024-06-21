/**
 * Renders left right channel to a canvas
 *
 * @param canvas canvas to render to
 * @param signal2D array with signal to render
 * @param drawFreq draw period = 1/drawFreq
 * @param F sample rate
 * @returns void
 */
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

    // background + grid
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#555'
    ctx.fillRect(0, (h * 1) / 2, w, 2)
    ctx.fillRect(0, (h * 1) / 4, w, 2)
    ctx.fillRect(0, (h * 3) / 4, w, 2)
    ctx.fillStyle = '#333'
    ctx.fillRect(0, (h * 1) / 8, w, 2)
    ctx.fillRect(0, (h * 3) / 8, w, 2)
    ctx.fillRect(0, (h * 5) / 8, w, 2)
    ctx.fillRect(0, (h * 7) / 8, w, 2)

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
    ctx.fillStyle = 'orange'
    for (let i = 0; i < numSamplesToDraw; ++i) {
        const canvasX = i * (w / numSamplesToDraw)
        const y = signal[triggerIndex + i]
        const canvasY = h / 2 - (y * h) / 2
        ctx.fillRect(canvasX, canvasY, 2, 2)
    }
    // console.timeEnd('draw-scope')
}

/**
 * Renders left right channel and left-right difference
 *
 * @param canvas canvas to render to
 * @param signal2D array with signal to render
 * @param drawFreq draw period = 1/drawFreq
 * @param F sample rate
 * @returns void
 */
export function drawSignal3D(
    canvas: HTMLCanvasElement,
    signal2D: Float32Array[],
    drawFreq: number = 400,
    F: number = 48000,
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    // console.time('draw-scope')
    const signal = signal2D[0]
    const signalR = signal2D[1]

    const w = canvas.width
    const h = canvas.height
    const h0 = canvas.height / 4
    const h1 = (canvas.height / 4) * 3
    const numSamplesToDraw = (F / drawFreq) * 2

    if (numSamplesToDraw * 2 > signal.length) {
        console.warn('not enough sample for canvas', canvas)
    }

    // background + grid
    ctx.fillStyle = '#222'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'white'
    ctx.fillRect(0, h / 2, w, 2)
    ctx.fillStyle = '#999'
    ctx.fillRect(0, h0, w, 2)
    ctx.fillRect(0, h1, w, 2)

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
    ctx.fillStyle = 'orange'
    for (let i = 0; i < numSamplesToDraw; ++i) {
        const canvasX = i * (w / numSamplesToDraw)
        const y = signal[triggerIndex + i]
        const canvasY = h0 - y * (h / 4)
        ctx.fillRect(canvasX, canvasY, 2, 2)
    }
    ctx.fillStyle = 'green'
    for (let i = 0; i < numSamplesToDraw; ++i) {
        const canvasX = i * (w / numSamplesToDraw)
        const y = signalR[triggerIndex + i]
        const canvasY = h0 - y * (h / 4)
        ctx.fillRect(canvasX, canvasY, 2, 2)
    }
    ctx.fillStyle = 'cyan'
    for (let i = 0; i < numSamplesToDraw; ++i) {
        const canvasX = i * (w / numSamplesToDraw)
        const io = triggerIndex + i
        const y = signal[io] - signalR[io]
        const canvasY = h1 - y * (h / 4)
        ctx.fillRect(canvasX, canvasY, 2, 2)
    }

    // console.timeEnd('draw-scope')
}
