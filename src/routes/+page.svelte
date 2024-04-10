<script lang="ts">
    import '$lib/audio'
    // import { startOsc, stopOsc, started } from '$lib/audio'
    import BaseOscillator, { getDefaultConfig } from '$lib/audio/BaseOscillator'
    import Scope from '$lib/component/Scope.svelte'
    import { unstate, untrack } from 'svelte'

    let started = $state(false)
    let selected: any = $state(null)

    const player = new BaseOscillator()
    player.output.toDestination()
    player.onState = (isPlaying) => (started = isPlaying)

    let configs: any[] = $state([])

    function play(index: number) {
        player.stop()
        player.config = configs[index]
        player.volume = configs[index].volume
        configs[index] = player.config
        configs[index].volume = player.volume
        selected = index
        player.start()
    }

    function stop() {
        player.stop()
    }

    function add() {
        const c = { volume: 0.5, ...getDefaultConfig() }
        configs.push(c)
    }

    $effect(() => {
        untrack(() => {
            const data = localStorage.getItem('configs-base')
            if (!data) return
            configs = JSON.parse(data) as any
            console.log('loaded', unstate(configs))
        })
    })

    $effect(() => {
        localStorage.setItem('configs-base', JSON.stringify(configs))
        console.log('stored')
    })

    add()
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

<button class="mt-8" onclick={add}>Add</button>

<div class="flex flex-col gap-y-2">
    {#each configs as config, index}
        <div class="flex items-center gap-x-2">
            <input type="number" bind:value={config.carrierFreq} />
            <input type="number" bind:value={config.volume} />
            <input type="number" bind:value={config.pulseFreq} />
            <input type="number" bind:value={config.pulseSquish} />
            <button
                class="rounded-md bg-green-500 px-2 py-1 disabled:bg-gray-500"
                onclick={() => play(index)}
                disabled={started}
            >
                Start
            </button>
            <button
                class="rounded-md bg-red-500 px-2 py-1 disabled:bg-gray-500"
                onclick={() => stop()}
                disabled={selected !== index || !started}
            >
                Stop
            </button>
            {#if selected === index}
                <p>Selected</p>
            {/if}
        </div>
    {/each}
</div>
