<script lang="ts">
    import Login from '$components/login.svelte';
    import Popup from '$components/popup.svelte';
    import Toast from '$components/toast.svelte';
    import userStore from '$stores/user.store';




	// props
	let { children } = $props();
</script>




<div id="app">
	<div id="page-wrapper">
		{#if $userStore}
		{@render children?.()}
		{:else}
		<Login />
		{/if}
	</div>
	
	<Popup />
	<Toast />
</div>




<style>
	#app {
		position: relative;
		width: 1334px;
		height: 800px;
		padding: 5rem;
		background-color: var(--color-sub);
	}

	#page-wrapper {
		width: 100%;
		height: 100%;
		border-radius: 5rem;
		background-color: var(--color-background);
	}


	/* GLOBAL STYLE */
    :global(*::-webkit-scrollbar) {
		width: 1rem;
		height: 1rem;
		background-color: var(--color-background);
	}
	:global(*::-webkit-scrollbar-thumb) {
		border-radius: 9999rem;
		background-color: #c6bfb4;
	}
	:global(*::-webkit-scrollbar-corner) {
		background-color: var(--color-background);
	}
</style>