<script lang="ts">
    import InputBox from '$lib/component/InputBox.svelte'
    import { freq, freqDelta, gain, phase, squish } from '$lib'
    import DualOscillator, { type DualOscillatorConfig } from '$lib/audio/DualOscillator'
    import ScopeTriphase from '$lib/component/ScopeTriphase.svelte'
    import { clamp } from '$lib/audio/utils'
    import { profileStorage as createProfileStorage } from '$lib/storage.svelte'
    import {
        PlaySolid,
        PauseSolid,
        GridPlusSolid as PlusIcon,
        CaretUpSolid as UpIcon,
        CaretDownSolid as DownIcon,
        TrashBinSolid as DeleteIcon,
        FileCopyAltSolid as DuplicateIcon,
        DownloadSolid as LoadIcon,
        FloppyDiskSolid as SaveIcon,
    } from 'flowbite-svelte-icons'

    let started = $state(false)
    let selectedId: number = $state(-1)
    let gainBoost = $state({ current: 0, delta: 0 })

    const player = new DualOscillator()
    player.output.toDestination()
    player.onState = (isPlaying) => (started = isPlaying)

    let configs: (DualOscillatorConfig & { id: number })[] = $state([])

    function play(id: number) {
        const selectedIndex = configs.findIndex((x) => x.id === id)
        if (selectedIndex < 0) return
        player.stop()

        const selectedConfig = configs[selectedIndex]
        player.config = selectedConfig
        configs[selectedIndex] = { id, ...structuredClone(player.config) }
        // configs[index] = player.config
        // configs[index].volume = player.volume
        selectedId = id
        gainBoost = { current: selectedConfig.volume, delta: 0 }
        player.start()
    }

    function stop() {
        gainBoost.delta = 0
        player.stop()
    }

    function getMaxId() {
        return configs.map((x) => x.id).reduce((prev, curr) => (curr > prev ? curr : prev), -1)
    }

    function add() {
        const maxId = getMaxId()
        const config = structuredClone(
            $state.snapshot(configs.find((x) => x.id === maxId) ?? DualOscillator.defaultConfig),
        )
        const configWithId = { ...config, id: maxId + 1 }
        configs.push(configWithId)
    }

    function remove(id: number) {
        const removeIndex = configs.findIndex((c) => c.id === id)
        if (removeIndex < 0) return
        configs.splice(removeIndex, 1)
    }

    function moveUp(id: number) {
        const srcIndex = configs.findIndex((c) => c.id === id)
        if (srcIndex < 0) return // no such item
        if (srcIndex == 0) return // no more up

        const dstIndex = srcIndex - 1
        const src = configs[srcIndex]
        configs[srcIndex] = configs[dstIndex]
        configs[dstIndex] = src
    }

    function moveDown(id: number) {
        const srcIndex = configs.findIndex((c) => c.id === id)
        if (srcIndex < 0) return // no such item
        if (srcIndex >= configs.length - 1) return // no more down

        const dstIndex = srcIndex + 1
        const src = configs[srcIndex]
        configs[srcIndex] = configs[dstIndex]
        configs[dstIndex] = src
    }

    function duplicate(id: number) {
        const srcIndex = configs.findIndex((c) => c.id === id)
        if (srcIndex < 0) return // no such item

        const duplicated = structuredClone($state.snapshot(configs[srcIndex]))
        // console.log(duplicated)
        duplicated.id = getMaxId() + 1

        configs.splice(srcIndex + 1, 0, duplicated)
    }

    function addGainBoost(offset: number) {
        if (!started) return

        const current = gainBoost.current
        const newDelta = clamp(current + gainBoost.delta + offset, 0, 1) - current
        gainBoost.delta = newDelta
        updateBoost()
    }

    function resetBoost() {
        if (!started) return

        gainBoost.delta = 0
        updateBoost()
    }

    function updateBoost() {
        if (!started) return

        const gainValue = clamp(gainBoost.current + gainBoost.delta, 0, 1)
        player.setGain(gainValue)
    }

    function toOffset(value: number): string {
        if (value >= 0) {
            return '+' + value.toFixed(2)
        } else {
            return value.toFixed(2)
        }
    }

    add()

    let ramp: number | null = $state(null)

    $effect(() => {
        if (started) {
            const interval = setInterval(() => {
                ramp = player.getRampGain()
            }, 1000 / 60)

            return () => {
                clearInterval(interval)
            }
        } else {
            ramp = null
        }
    })

    const profileStorage = createProfileStorage()

    let saveNameInput = $state('')
    let canSave = $derived(saveNameInput.trim().length > 0)

    let loadNameInput: string | null = $state(null)
    let profileLoaded: string | null = $state(null)

    let canDelete = $derived(Boolean(loadNameInput))

    let canLoad = $derived(
        JSON.stringify($state.snapshot(configs)) !== profileLoaded && loadNameInput,
    )

    $effect(() => {
        const res = profileStorage.getByName(loadNameInput)
        profileLoaded = res == null ? null : JSON.stringify($state.snapshot(res.payload))
    })

    function saveProfile() {
        const res = profileStorage.save(saveNameInput, $state.snapshot(configs))
        if (res) {
            loadNameInput = saveNameInput
            profileLoaded = JSON.stringify($state.snapshot(configs))
            saveNameInput = ''
        } else {
            saveNameInput = 'error'
        }
    }

    function loadProfile() {
        if (loadNameInput && loadNameInput.trim().length > 0) {
            const payload = profileStorage.load(loadNameInput)
            if (payload) {
                configs = payload as any
                profileLoaded = JSON.stringify($state.snapshot(payload))
                // setTimeout(() => (currentLoadName = loadNameInput))
            } else {
                alert('No such profile')
            }
        }
    }

    function deleteProfile() {
        if (loadNameInput && loadNameInput.trim().length > 0) {
            const res = profileStorage.delete(loadNameInput)
            if (!res) alert('no such profile')
            loadNameInput = null
        }
    }
</script>

{#snippet trackHeader()}
    <div class="mb-4 flex flex-row items-center justify-start gap-x-8">
        <h1 class="text-3xl text-zinc-200">Tracks</h1>

        <input bind:value={saveNameInput} />
        <button onclick={saveProfile} disabled={!canSave} class="disabled:opacity-25">Save</button>

        <select bind:value={loadNameInput} class="w-32">
            <option value={null} selected class="text-gray-400">-- None --</option>
            {#each profileStorage.get() as p (p.id)}
                <option value={p.id}>{p.id}</option>
            {/each}
        </select>

        <button onclick={loadProfile} disabled={!canLoad} class="disabled:opacity-25">Load</button>
        <button onclick={deleteProfile} disabled={!canDelete} class="disabled:opacity-25"
            >Delete</button
        >
    </div>
{/snippet}

{#snippet trackBox(config: (typeof configs)[0], index: number, len: number)}
    <div
        class="relative flex flex-row items-center gap-x-2 rounded-xl border border-zinc-900 bg-zinc-700 p-2"
    >
        <h2
            class="chakra-petch-regular absolute bottom-0 right-full top-0 mr-2 mt-1 size-4 text-center text-xl font-bold text-gray-500"
        >
            <span>
                {config.id}
            </span>
        </h2>

        <div class="flex flex-col justify-between gap-y-2">
            <button
                onclick={() => moveUp(config.id)}
                disabled={index <= 0}
                class="block rounded-md border border-zinc-600 p-1 enabled:hover:bg-gray-300 disabled:opacity-30"
                ><UpIcon class="size-4" /></button
            >
            <button
                onclick={() => moveDown(config.id)}
                disabled={index >= len - 1}
                class="block rounded-md border border-zinc-600 p-1 enabled:hover:bg-gray-300 disabled:opacity-30"
                ><DownIcon class="size-4" /></button
            >
        </div>

        <div class="flex flex-col justify-between gap-y-2">
            <button
                onclick={() => remove(config.id)}
                class="block rounded-md border border-zinc-600 p-1 text-red-400 enabled:hover:text-red-500 disabled:opacity-30"
                ><DeleteIcon class="size-4" /></button
            >
            <button
                onclick={() => duplicate(config.id)}
                class="block rounded-md border border-zinc-600 p-1 text-blue-500 enabled:hover:text-blue-600 disabled:opacity-30"
                ><DuplicateIcon class="size-4" /></button
            >
        </div>

        <div
            class="h-12 w-2 shrink-0 self-center rounded-xl border border-black border-opacity-50 py-1 {selectedId ===
            config.id
                ? 'bg-orange-500'
                : 'bg-zinc-500'}"
        ></div>
        <!-- <span class="text-xl font-bold text-gray-400">~</span> -->
        <div class="flex w-40 flex-col gap-y-2">
            <div class="flex flex-row gap-x-1">
                <InputBox
                    bind:value={config.carrierFreq}
                    className="w-full"
                    format={freq()}
                    units="Hz"
                    step={50}
                />
            </div>
            <div class="flex flex-row gap-x-1">
                <InputBox
                    bind:value={config.carrierFreqDelta}
                    className="w-1/2"
                    format={freqDelta()}
                    units="Hz"
                    step={1}
                />
                <InputBox
                    bind:value={config.carrierPhaseDelta}
                    className="w-1/2 text-green-400"
                    format={phase()}
                    step={10}
                    units="deg"
                />
            </div>
        </div>
        <!-- <span class="text-xl font-bold text-gray-400">^</span> -->
        <div class="flex flex-col items-end gap-y-2">
            <InputBox
                bind:value={config.pulseFreq}
                className="w-20"
                format={freq()}
                units="Hz"
                step={1}
            />
            <InputBox
                bind:value={config.pulseSquish}
                className="w-20 text-cyan-400"
                format={squish()}
                step={0.1}
            />
        </div>

        <div class="flex flex-col gap-y-2">
            <InputBox
                bind:value={config.volume}
                className="w-16 text-yellow-400"
                format={gain()}
                step={0.01}
            />
            <InputBox
                bind:value={config.volume}
                className="w-16 text-yellow-400"
                format={gain()}
                step={0.01}
            />
        </div>

        <div class="flex flex-row items-center gap-x-2 px-1">
            <button
                class="flex size-8 items-center rounded-md border border-black border-opacity-50 bg-green-500 disabled:bg-gray-500"
                onclick={() => play(config.id)}
                disabled={started}
            >
                <PlaySolid class="mx-auto size-6" />
            </button>
            <button
                class="flex size-8
                items-center rounded-md border border-black border-opacity-50 bg-red-500 disabled:bg-gray-500"
                onclick={() => stop()}
                disabled={selectedId !== config.id || !started}
            >
                <PauseSolid class="mx-auto size-6" />
            </button>
        </div>
    </div>
{/snippet}

<div class="flex flex-row gap-x-32">
    <div class="flex flex-col items-start">
        {@render trackHeader()}

        <div class="flex flex-col items-start gap-y-2">
            {#each configs as config, i (config.id)}
                {@render trackBox(config, i, configs.length)}
            {/each}

            <div class="mt-2 flex flex-col items-center self-stretch">
                <button
                    class="flex justify-center rounded-md bg-gray-700 px-3 py-1 text-base text-gray-300 hover:bg-gray-600"
                    onclick={add}
                >
                    <PlusIcon class="mr-2 size-6" />
                    Add Track</button
                >
            </div>
        </div>
    </div>

    <div class="flex flex-col">
        <h1 class="text-3xl text-zinc-200">Boost</h1>
        <div class="mt-4 flex flex-row items-center">
            <div
                class="flex flex-row items-center justify-center gap-x-4 rounded-xl border border-zinc-900 bg-zinc-700 p-2 px-6"
            >
                <div class="flex w-20 flex-col items-end gap-y-1.5">
                    <div
                        class="chakra-petch-regular inline-block w-full rounded-md bg-gray-900 px-2 pt-0.5 text-end align-middle text-2xl text-gray-300"
                    >
                        {#if started}
                            {gainBoost.current.toFixed(2)}
                        {:else}
                            N/A
                        {/if}
                    </div>
                    <div
                        class="chakra-petch-regular inline-block w-full rounded-md bg-gray-900 px-2 pt-0.5 text-end align-middle text-2xl text-gray-400"
                    >
                        {toOffset(gainBoost.delta)}
                    </div>
                </div>
                <div class="text-4xl">→</div>
                <div
                    class="chakra-petch-regular align-midlle inline-block w-24 rounded-md bg-gray-900 px-2 py-1 pt-1.5 text-center text-4xl"
                >
                    {#if started}
                        <span
                            class={gainBoost.delta > 0
                                ? 'text-yellow-500'
                                : gainBoost.delta < 0
                                  ? 'text-blue-900'
                                  : ''}
                        >
                            {(gainBoost.delta + gainBoost.current).toFixed(2)}
                        </span>
                    {:else}
                        N/A
                    {/if}
                </div>
            </div>

            <div
                class="relative ml-2 h-5/6 w-2 overflow-clip rounded-xl border border-zinc-900 bg-gray-500"
            >
                <p
                    class={`absolute w-full ${ramp == 1.0 ? 'bg-green-400' : 'bg-yellow-400'}`}
                    style={'bottom:0;top:' + `${100 - (ramp || 0.0) * 100}%`}
                ></p>
            </div>
        </div>
    </div>

    <div>
        <h1 class="mb-4 text-3xl text-zinc-200">Scope</h1>

        <ScopeTriphase node={player.output} />

        <button
            class="mt-8 w-full rounded-md bg-red-500 px-2 py-1 text-center disabled:bg-gray-500"
            onclick={() => player.stop()}
            disabled={!started}>Stop All</button
        >
    </div>
</div>

<svelte:window
    onkeydown={(e) => {
        e.key === ' ' && stop()

        if (e.key === 'ArrowUp') {
            addGainBoost(+0.01)
        } else if (e.key === 'ArrowDown') {
            addGainBoost(-0.01)
        } else if (e.key === 'Delete') {
            resetBoost()
        }
    }}
/>

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
