<script>
    import '$lib/audio'
    // import { startOsc, stopOsc, started } from '$lib/audio'
    import BaseOscillator from '$lib/audio/BaseOscillator'
    import Scope from '$lib/component/Scope.svelte'

    let started = $state(false)

    const player = new BaseOscillator()
    player.output.toDestination()
    player.onState = (isPlaying) => (started = isPlaying)
</script>

<button
    class="rounded-md bg-green-500 px-2 py-1 disabled:bg-gray-500"
    onclick={() => player.start()}
    disabled={started}>Start</button
>
<button
    class="rounded-md bg-red-500 px-2 py-1 disabled:bg-gray-500"
    onclick={() => player.stop()}
    disabled={!started}>Stop</button
>
<p class="mb-10 mt-1">{started ? 'Started' : 'Stopped'}</p>
<Scope node={player.output} />
