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

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<button onclick={() => player.start()}>Start</button>
<button onclick={() => player.stop()}>Stop</button>
<p>{started ? 'hi' : 'no'}</p>
<Scope node={player.output} />
