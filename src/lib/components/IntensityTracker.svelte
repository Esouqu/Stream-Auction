<script lang="ts">
	import { onMount } from 'svelte';
	import flameGif from '$lib/assets/flame.gif';
	import donations from '$lib/stores/donations';
	import lots from '$lib/stores/lots';

	const INTENSITY_DECREASE_TIME = 15;
	const MAX_INTENSITY = 4;

	export let minIntensityValue: number;
	export let isDonationsOn: boolean;
	export let isVisible = false;

	let intensityAmount = 0;
	let intensityIntervalId: NodeJS.Timeout;

	onMount(() => {
		const unsubDonations = donations.itemAdded.subscribe((donation) => {
			if (isDonationsOn && donation) processValue(donation.amount_in_user_currency);
		});
		const unsubLots = lots.itemAdded.subscribe((lot) => {
			if (!isDonationsOn && lot) processValue(lot.value);
		});
		const unsubLotsValue = lots.lotValueChanged.subscribe((lot) => {
			if (!isDonationsOn && lot?.addedValue) processValue(lot.addedValue);
		});

		return () => {
			unsubDonations();
			unsubLots();
			unsubLotsValue();
		};
	});

	function processValue(value: number) {
		if (value < minIntensityValue) return;

		let toAdd = 1;

		if (value >= minIntensityValue * 2) {
			toAdd = 2;
		}

		if (value >= minIntensityValue * 4) {
			toAdd = 4;
		}

		intensityAmount =
			intensityAmount + toAdd > MAX_INTENSITY ? MAX_INTENSITY : intensityAmount + toAdd;

		clearInterval(intensityIntervalId);

		intensityIntervalId = setInterval(() => {
			if (intensityAmount < 1) clearInterval(intensityIntervalId);

			intensityAmount = intensityAmount - 1 > 0 ? intensityAmount - 1 : 0;
		}, INTENSITY_DECREASE_TIME * 1000);
	}
</script>

<div
	style="--flame-gif: url({flameGif}); --flame-size: {40 + 15 * intensityAmount}vh;"
	class="flame"
	class:visible={isVisible}
/>

<style lang="scss">
	.flame {
		position: fixed;
		z-index: 0;
		border: 0;
		width: 100%;
		height: 100%;
		background-image: var(--flame-gif);
		background-size: var(--flame-size, 40vh);
		background-repeat: repeat-x;
		background-position-y: 170%;
		background-position-x: center;
		transition: background-size 3s ease-in-out;
	}
</style>
