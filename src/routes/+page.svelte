<script lang="ts">
    import Character from "$components/character.svelte";
    import Unity from "$components/unity.svelte";
    import userStore from "$stores/user.store";
    import { onMount } from "svelte";



    onMount(() => {
        console.log($userStore);
    })
</script>



<div id="page-wrapper">
    {#if $userStore?.c_type}
    <Unity />
    {:else}
    <Character />
    {/if}
</div>



<style>
    #page-wrapper {
        width: 100%;
        height: 100%;
    }
</style>