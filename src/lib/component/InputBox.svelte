<script lang="ts">
    import { gain, type NumberFormatter } from '$lib'

    let {
        value = $bindable(),
        format = gain(),
        units,
        className = '',
    }: {
        value: number
        format: NumberFormatter
        units?: string
        className?: string
    } = $props()

    let formatted = $derived(format.into(value))

    const onUpdate = (e: any) => (value = format.from(e.currentTarget.value))
</script>

<div class="{className} relative flex items-center">
    <input
        class="chakra-petch-regular align-midlle inline-block w-full rounded-md bg-gray-900 pt-0.5 text-center text-white"
        value={formatted}
        type="number"
        onchange={onUpdate}
        onpaste={onUpdate}
        step={0.1}
    />
    {#if units}
        <span
            class="chakra-petch-regular pointer-events-none absolute right-0 inline-block select-none pe-2 align-middle text-sm text-gray-500"
            >{units}</span
        >
    {/if}
</div>
