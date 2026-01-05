<script lang="ts">
    import loadingStore from "$stores/loading.store";
    import { onMount } from "svelte";




    /**
     * onMount()
    */
    onMount(() => {
        loadingStore.off();
    });
</script>







<style>

</style>