<script lang="ts">
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Button from './Button.svelte';
	import { fly } from 'svelte/transition';
	import type { ILot } from '$lib/interfaces';
	import donationalertsIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import settings from '$lib/stores/settings';
	import { getShortenedText } from '$lib/utils';

	export let id: number | string;
	export let type: 'Twitch' | 'Donation Alerts';
	export let message: string;
	export let username: string;
	export let amount: number;
	export let amount_in_user_currency: number;
	export let currency: string;
	export let isDragged = false;
	export let mostSimilarLot: ILot | undefined = undefined;
	export let isInstant = false;

	let moveDirection: 1 | -1 = 1;

	$: transparency = settings.transparency;

	function removeDonation() {
		moveDirection = 1;
		donations.remove(id);
	}

	function addSimilarVariant(e: Event) {
		if (!mostSimilarLot) return;
		e.stopPropagation();

		moveDirection = -1;
		lots.addValue(mostSimilarLot.id, amount_in_user_currency, username);
		donations.remove(id);
	}

	function addVariant(e: Event) {
		e.stopPropagation();

		moveDirection = -1;
		lots.add(message, amount_in_user_currency, username);
		donations.remove(id);
	}

	function handleDragStart(e: DragEvent) {
		e.dataTransfer?.setData(
			'application/json',
			JSON.stringify({
				id,
				value: amount_in_user_currency,
				username
			})
		);
		moveDirection = -1;
		isDragged = true;
	}
</script>

<div
	class="donation-wrapper"
	class:dragged={isDragged}
	class:donation-alerts={type === 'Donation Alerts'}
	class:interactive={!isInstant}
	style="--donation-opacity: {$transparency};"
	draggable={!isInstant}
	aria-hidden
	on:dragstart={handleDragStart}
	on:dragend={() => (isDragged = false)}
	in:fly={{ y: 100 }}
	out:fly={{ x: 300 * moveDirection }}
>
	<div class="donation-icon icon-wrapper">
		<img src={donationalertsIcon} alt="Donationalerts Icon" draggable="false" />
	</div>
	<div class="donation" class:donation_small={isInstant}>
		{#if isInstant}
			<span>{message}</span>
			<span>+{amount} {currency}</span>
		{:else}
			<div class="donation__info" style="line-height: 24px;">
				<p>{username}</p>
				<p>{amount} {currency}</p>
			</div>
			<div>
				<p class="donation__description">{message}</p>
			</div>

			<div class="donation-buttons-wrapper">
				<Button icon="listAddItem" on:click={addVariant} />
				{#if mostSimilarLot}
					<Button
						icon="plus"
						text={getShortenedText(mostSimilarLot.title, 21)}
						on:click={addSimilarVariant}
					/>
				{/if}
				<Button icon="delete" on:click={removeDonation} />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.donation {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		padding: 15px 15px 10px 15px;
		width: 100%;
		overflow: hidden;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			opacity: var(--donation-opacity);
			background-color: var(--surface-container-highest);
		}

		&-icon {
			padding: 0 8px;
			height: auto;
			width: 24px;
			background-image: linear-gradient(to bottom, #fa9d3e 0%, #f76b1c 100%);
		}

		&-wrapper {
			position: relative;
			display: flex;
			border-radius: 10px;
			width: 100%;
			box-shadow: var(--elevation-1);
			line-height: 18px;
			transition: 0.2s;
			user-select: none;
			overflow: hidden;

			&.dragged {
				filter: grayscale(1);
				opacity: 0.3;
				transition: none;
			}

			&.interactive {
				cursor: grab;

				&:active {
					cursor: grabbing;
				}
			}
		}

		&_small {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 20px;
			padding: 15px 10px;
			font-size: 18px;
			font-weight: 700;
			user-select: none;
			pointer-events: none;

			& span:nth-child(1) {
				// text-overflow: ellipsis;
				word-break: break-word;
				overflow: hidden;
			}
		}
		&__description {
			margin: 10px 0;
			font-size: 15px;
			letter-spacing: 0.25px;
			overflow-wrap: break-word;
			overflow: hidden;
		}

		&-buttons-wrapper {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}

		&__info {
			display: flex;
			justify-content: space-between;
			align-items: center;

			& p {
				margin: 0;
				font-size: 18px;
				font-weight: 600;
				letter-spacing: 0.5px;
			}
		}
	}
</style>
