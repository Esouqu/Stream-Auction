<script lang="ts">
	import Lot from '$lib/components/Lot.svelte';
	import lots from '$lib/stores/lots';
	import { flip } from 'svelte/animate';
	import { fade, fly } from 'svelte/transition';
	import { getTotal } from '$lib/utils';
	import Popup from '$lib/components/Popup.svelte';
	import Addlot from '$lib/components/Addlot.svelte';

	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
</script>

<svelte:head>
	<title>Аукцион</title>
</svelte:head>

<section class="auction-section">
	<Addlot />

	{#if $lots.length > 0}
		<ol class="lots-list">
			{#each sortedLots as lot (lot.id)}
				{@const percent = (lot.value / getTotal($lots.map((item) => item.value))) * 100}

				<li animate:flip={{ duration: 200 }} transition:fly={{ duration: 200 }}>
					<Lot {...lot} value={String(lot.value)} {percent} />
				</li>
			{/each}
		</ol>
	{:else}
		<div class="no-lots" transition:fade>
			<p>Лоты отсутствуют</p>
		</div>
	{/if}
</section>

<style lang="scss">
	.auction-section {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
	.lots-list {
		display: flex;
		flex-direction: column;
		flex: 1 1 0;
		gap: 10px;
		padding: 0 30px;
		margin: 0;
		color: white;
		list-style-type: none;
		overflow-x: hidden;
		overflow-y: auto;
		scrollbar-gutter: stable;
	}
	.no-lots {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 30px;
		height: 100%;
		font-size: 24px;
	}
</style>
