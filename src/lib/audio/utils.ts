export function drawSignal(
    canvas: HTMLCanvasElement,
    signal: Float32Array,
    drawFreq: number = 400,
    F: number = 48000,
) {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    const drawNumSamples = (F / drawFreq) * 2

    if (signal.length * 0.5 < drawNumSamples) {
        console.warn('not enough sample for canvas', canvas)
    }

    // background
    ctx.fillStyle = '#333'
    ctx.fillRect(0, 0, w, h)

    let offset = 0
    let detectActive = false
    const lookBack = 5
    const marginY = 0.01
    const triggerY = signal.reduce((prev, curr) => Math.max(prev, curr)) - marginY

    for (let i = lookBack; i < signal.length - drawNumSamples - 1; i++) {
        const y = signal[i]
        const yPrev = signal[i - lookBack]

        if (y > marginY) detectActive = true

        if (yPrev < triggerY && y > triggerY) {
            offset = i
            break
        }
    }

    if (detectActive && offset === 0) console.warn('no trigger for scope', canvas)

    // console.log(offset)

    //line
    ctx.fillStyle = 'white'
    for (let i = 0; i < drawNumSamples; ++i) {
        const x = i * (w / drawNumSamples)
        const y = h - (h / 2 + ((signal[offset + i] * h) / 2) * 0.99)
        ctx.fillRect(x, y, 2, 2)
    }
    // console.log('draw')
}
