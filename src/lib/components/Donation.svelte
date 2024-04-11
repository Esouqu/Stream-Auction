<script lang="ts">
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Button from './Button.svelte';
	import { fly } from 'svelte/transition';
	import type { ILot } from '$lib/interfaces';

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

	function handleAddSimilar(e: Event) {
		if (!mostSimilarLot) return;
		e.stopPropagation();

		lots.addValue(mostSimilarLot.id, amount_in_user_currency, username);
		donations.remove(id);
	}
	function handleAdd(e: Event) {
		e.stopPropagation();

		lots.add(message, amount_in_user_currency, username);
		donations.remove(id);
	}

	function handleDragStart(e: DragEvent) {
		const obj = {
			id,
			value: amount_in_user_currency,
			username
		};

		e.dataTransfer?.setData('application/json', JSON.stringify(obj));
		isDragged = true;
	}
</script>

<div
	class="donation-wrapper"
	class:dragged={isDragged}
	class:twitch={type === 'Twitch'}
	class:donation-alerts={type === 'Donation Alerts'}
	draggable={!isInstant}
	aria-hidden
	on:dragstart={handleDragStart}
	on:dragend={() => (isDragged = false)}
	in:fly={{ y: 100 }}
	out:fly={{ x: 500 }}
>
	<div class="donation" class:donation_small={isInstant}>
		{#if isInstant}
			<span>{message}</span>
			<span>+{amount} {currency}</span>
		{:else}
			<div class="donation__info">
				<p>{username}</p>
				<p>{amount} {currency}</p>
			</div>
			<div>
				<p class="donation__description">{message}</p>
			</div>

			<div class="donation-buttons-wrapper">
				<Button
					icon="listAddItem"
					iconColor={type === 'Twitch' ? 'white' : 'black'}
					on:click={handleAdd}
				/>
				{#if mostSimilarLot}
					<Button
						icon="plus"
						iconColor={type === 'Twitch' ? 'white' : 'black'}
						title={mostSimilarLot.title}
						on:click={handleAddSimilar}
					/>
				{/if}
				<Button
					icon="delete"
					iconColor={type === 'Twitch' ? 'white' : 'black'}
					on:click={() => donations.remove(id)}
				/>
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
		padding: 20px;
		overflow: hidden;
		cursor: grab;

		&-wrapper {
			position: relative;
			border-radius: 5px;
			width: 100%;
			box-shadow: var(--elevation-3);
			line-height: 18px;
			transition: 0.2s;
			user-select: none;

			&.donation-alerts {
				color: var(--on-donation-orange);
				background-color: var(--donation-orange);

				&::before {
					opacity: 0.1;
					background-image: url('/src/lib/assets/donationalerts_background.png');
				}
			}
			&.twitch {
				color: var(--on-primary-container);
				background-color: var(--primary-50);

				&::before {
					opacity: 0.07;
					background-image: url('/src/lib/assets/twitch_background.png');
				}
			}

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				width: 100%;
				height: 100%;
				opacity: 0.1;
				/* background-image: url('/src/lib/assets/donationalerts_background.png'); */
				background-position: center center;
				background-repeat: no-repeat;
				/* background-size: contain; */
			}

			&.dragged {
				filter: grayscale(1);
				opacity: 0.3;
				transition: none;
			}

			&:active :not(.donation_small) {
				cursor: grabbing;
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
			font-weight: 500;
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
				font-weight: 700;
				letter-spacing: 0.5px;
			}
		}
	}
</style>
