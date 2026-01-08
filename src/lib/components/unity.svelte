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


<canvas id="unity-canvas"></canvas>


<style>
    #unity-canvas {
        width: 100%;
        height: 100%;
    }
</style>