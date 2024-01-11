<script lang="ts">
	import { fade } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import Addlot from '$lib/components/Addlot.svelte';
	import VirtualList from '$lib/components/VirtualList.svelte';
</script>

<svelte:head>
	<title>Лоты - Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div class="add-lot-wrapper">
		<Addlot />
	</div>
	<div class="virtual-list-wrapper">
		<VirtualList />
		{#if $lots.length < 1}
			<div class="no-lots" transition:fade>
				<p>Лоты отсутствуют</p>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	.virtual-list-wrapper {
		position: relative;
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		overflow: hidden;
	}
	.add-lot-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 26px;
	}
	.auction-section {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
	}
	.no-lots {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1 1 0;
		width: 100%;
		height: 100%;
		font-size: 24px;
	}
</style>
