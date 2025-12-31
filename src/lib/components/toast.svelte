<script lang="ts">
    import toastStore from "$stores/toast.store";
    import { flip } from "svelte/animate";
    import { fly } from "svelte/transition";
</script>



<div id="toast-wrapper">
    <ul id="toast-list">
        {#each Object.entries($toastStore) as [key, data] (key)}
        <li class="toast {data.type}"
        in:fly={{x: 0, y: 20, duration: 300}}
        out:fly={{x: 0, y: -20, duration: 300}}
        animate:flip={{duration: 300}}>
            {data.message}
        </li>
        {/each}
    </ul>
</div>



<style>
    #toast-wrapper {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        overflow: visible;
        z-index: 2000;
    }
    
    
    #toast-list {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translate(-50%, -6rem);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: visible;


        & .toast {
            width: 35rem;
            padding: 1.7rem;
            font-size: 1.5rem;
            font-weight: bold;
            border-radius: 1.5rem;
            border: 0.2rem solid var(--color-border);
            background-color: var(--color-sub);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
        }
        & .toast.success {
            background-color: var(--color-success);
        }
        & .toast.warning {
            color: var(--color-fail);
        }
    }
</style>