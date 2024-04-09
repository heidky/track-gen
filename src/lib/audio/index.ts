console.log('Initializing Audio stack')
import { writable } from 'svelte/store'
import * as Tone from 'tone'

let osc = new Tone.Oscillator({ frequency: 300, type: 'sine' })
osc.toDestination()

export let started = writable(false)

osc.onstop = () => {
    console.log('stop')
    started.set(false)
}

export async function startOsc() {
    await Tone.start()
    osc.start()
    started.set(true)
}

export function stopOsc() {
    osc.stop()
}
