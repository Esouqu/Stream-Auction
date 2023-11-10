<script lang="ts">
	import Lot from '$lib/components/Lot.svelte';
	import lots from '$lib/stores/lots';
	import { flip } from 'svelte/animate';
	import { fade, fly, slide } from 'svelte/transition';
	import { getTotal } from '$lib/utils';
	import Popup from '$lib/components/Popup.svelte';
	import Addlot from '$lib/components/Addlot.svelte';
	import Button from '$lib/components/Button.svelte';

	let isTotalShown = false;

	$: sortedLots = [...$lots].sort((a, b) => b.value - a.value);
	$: total = getTotal($lots.map((l) => l.value));
</script>

<svelte:head>
	<title>Лоты - Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div>
		<Addlot />
	</div>
	<div style="position: relative; display: flex; flex: 1 1 0; flex-direction: column;">
		<div class="utils-row">
			<p>Всего:</p>
			{#if isTotalShown}
				<p transition:slide={{ duration: 200, axis: 'x' }}>
					{total}
				</p>
			{/if}
			<Button icon="visibility" on:click={() => (isTotalShown = !isTotalShown)} />
			<div style="position: absolute; right: 35px;">
				<Button icon="trashcan" on:click={() => lots.removeAll()} />
			</div>
		</div>

		{#if $lots.length > 0}
			<ol class="lots-list">
				{#each sortedLots as lot (lot.id)}
					{@const percent = (lot.value / getTotal($lots.map((item) => item.value))) * 100}

					<li animate:flip={{ duration: 200 }}>
						<Lot {...lot} value={String(lot.value)} {percent} />
					</li>
				{/each}
			</ol>
		{:else}
			<div class="no-lots" transition:fade>
				<p>Лоты отсутствуют</p>
			</div>
		{/if}
	</div>
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
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1 1 0;
		width: 100%;
		height: 100%;
		font-size: 24px;
	}
	.utils-row {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 100%;
		height: 40px;
		margin: 10px 0;

		& p {
			height: 16px;
			font-weight: 600;
			margin: 0;
		}
	}
</style>
