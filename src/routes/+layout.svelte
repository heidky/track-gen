<script>
    import '../app.css'
    import '$lib'
</script>

<div class="m-10">
    <slot />
</div>

<style lang="postcss">
    :global(html) {
        background-color: #1a1c1d;
        color: white;
    }
</style>
