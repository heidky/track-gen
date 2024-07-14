<script lang="ts">
    import { freq, gain, squish } from '$lib'
    import '$lib/audio'
    // import { startOsc, stopOsc, started } from '$lib/audio'
    import BaseOscillator, { getDefaultConfig } from '$lib/audio/BaseOscillator'
    import InputBox from '$lib/component/InputBox.svelte'
    import Scope from '$lib/component/Scope.svelte'
    import { untrack } from 'svelte'

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
            console.log('loaded', $state.snapshot(configs))
        })
    })

    $effect(() => {
        localStorage.setItem('configs-base', JSON.stringify(configs))
        console.log('stored')
    })

    add()
</script>

<div class="flex flex-row">
    <div class="w-1/2">
        <div class="mb-4 flex flex-row items-center justify-start gap-x-8">
            <h1 class="text-3xl text-zinc-200">Tracks</h1>

            <button
                class="flex size-8 justify-center rounded-md bg-gray-400 px-3 py-0 text-lg font-bold hover:bg-gray-600"
                onclick={add}>+</button
            >
        </div>

        <div class="flex flex-col items-start gap-y-2">
            {#each configs as config, index}
                <div
                    class="border-1 flex items-center gap-x-2 rounded-xl bg-zinc-700 p-3 {selected !==
                    index
                        ? 'border border-gray-700'
                        : 'border border-orange-400'}"
                >
                    <span class="text-xl font-bold text-gray-400">~</span>
                    <InputBox
                        bind:value={config.carrierFreq}
                        className="w-24"
                        format={freq()}
                        units="Hz"
                        step={50}
                    />
                    <InputBox
                        bind:value={config.volume}
                        className="w-16 text-yellow-500"
                        format={gain()}
                        step={0.01}
                    />
                    <span class="text-xl font-bold text-gray-400">^</span>
                    <InputBox
                        bind:value={config.pulseFreq}
                        className="w-24"
                        format={freq()}
                        units="Hz"
                        step={1}
                    />
                    <InputBox
                        bind:value={config.pulseSquish}
                        className="w-16 text-cyan-500"
                        format={squish()}
                        step={0.1}
                    />

                    <button
                        class="ms-2 size-8 rounded-md bg-green-500 disabled:bg-gray-500"
                        onclick={() => play(index)}
                        disabled={started}
                    >
                        P
                    </button>
                    <button
                        class="size-8 rounded-md bg-red-500 disabled:bg-gray-500"
                        onclick={() => stop()}
                        disabled={selected !== index || !started}
                    >
                        S
                    </button>
                </div>
            {/each}
        </div>
    </div>

    <div>
        <h1 class="mb-4 text-3xl text-zinc-200">Scope</h1>

        <Scope node={player.output} />

        <button
            class="mt-8 w-full rounded-md bg-red-500 px-2 py-1 text-center disabled:bg-gray-500"
            onclick={() => player.stop()}
            disabled={!started}>Stop All</button
        >
    </div>
</div>

<svelte:window onkeydown={(e) => e.key === ' ' && player.stop()} />
