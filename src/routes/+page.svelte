<script lang="ts">
    import InputBox from '$lib/component/InputBox.svelte'
    import Scope from '$lib/component/Scope.svelte'
    import { freq, freqDelta, gain, phase, squish } from '$lib'
    import DualOscillator, { type DualOscillatorConfig } from '$lib/audio/DualOscillator'
    import { unstate } from 'svelte'

    let started = $state(false)
    let selectedId: number = $state(-1)

    const player = new DualOscillator()
    player.output.toDestination()
    player.onState = (isPlaying) => (started = isPlaying)

    let configs: (DualOscillatorConfig & { id: number })[] = $state([])

    function play(id: number) {
        const index = configs.findIndex((x) => x.id === id)
        if (index < 0) return
        player.stop()

        const c = configs[index]
        player.config = c
        configs[index] = { id, ...structuredClone(player.config) }
        // configs[index] = player.config
        // configs[index].volume = player.volume
        selectedId = id
        player.start()
    }

    function stop() {
        player.stop()
    }

    function getMaxId() {
        return configs.map((x) => x.id).reduce((prev, curr) => (curr > prev ? curr : prev), -1)
    }

    function add() {
        const maxId = getMaxId()
        const prevConfig = configs.find((x) => x.id === maxId) ?? DualOscillator.defaultConfig
        const newConfig = { ...structuredClone(unstate(prevConfig)), id: maxId + 1 }
        configs.push(newConfig)
    }

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
            {#each configs as config}
                <div
                    class="border-1 flex items-center gap-x-2 rounded-xl bg-zinc-700 p-2 {selectedId !==
                    config.id
                        ? 'border border-gray-700'
                        : 'border border-orange-400'}"
                >
                    <!-- <span class="text-xl font-bold text-gray-400">~</span> -->
                    <div class="flex flex-col gap-y-2">
                        <div class="flex flex-row gap-x-1">
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
                        </div>
                        <div class="flex flex-row gap-x-1">
                            <InputBox
                                value={config.carrierFreqDelta}
                                className="w-20"
                                format={freqDelta()}
                                units="Hz"
                                step={1}
                            />
                            <InputBox
                                value={config.carrierPhaseDelta}
                                className="w-20 text-green-500"
                                format={phase()}
                                step={10}
                                units="deg"
                            />
                        </div>
                    </div>
                    <!-- <span class="text-xl font-bold text-gray-400">^</span> -->
                    <div class="ms-2 flex flex-col items-end gap-y-2">
                        <InputBox
                            bind:value={config.pulseFreq}
                            className="w-20"
                            format={freq()}
                            units="Hz"
                            step={1}
                        />
                        <InputBox
                            bind:value={config.pulseSquish}
                            className="w-20 text-cyan-500"
                            format={squish()}
                            step={0.1}
                        />
                    </div>

                    <div class="flex flex-row items-center gap-x-2">
                        <button
                            class="ms-2 size-8 rounded-md bg-green-500 disabled:bg-gray-500"
                            onclick={() => play(config.id)}
                            disabled={started}
                        >
                            P
                        </button>
                        <button
                            class="size-8 rounded-md bg-red-500 disabled:bg-gray-500"
                            onclick={() => stop()}
                            disabled={selectedId !== config.id || !started}
                        >
                            S
                        </button>
                    </div>
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

<!-- $effect(() => {
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
}) -->
