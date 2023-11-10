<script lang="ts">
	import lots from '$lib/stores/lots';
	import donations from '$lib/stores/donations';
	import Button from './Button.svelte';
	import { fade, fly } from 'svelte/transition';
	import type { ILot } from '$lib/interfaces';

	export let id: number | string;
	export let type: 'Twitch' | 'Donation Alerts';
	export let message: string;
	export let username: string;
	export let amount: number;
	export let amount_in_user_currency: number;
	export let currency: string;
	export let isDragged = false;
	export let mostSimilarLot: ILot | null = null;

	function handleAddSimilar(e: Event) {
		e.stopPropagation();
		if (!mostSimilarLot) return;

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
	on:dragstart={(e) => handleDragStart(e)}
	on:dragend={() => (isDragged = false)}
	in:fly={{ y: 100 }}
	out:fade
	aria-hidden
	draggable="true"
>
	<div class="donation">
		<div class="donation__info">
			<p>{username}</p>
			<p>{amount} {currency}</p>
		</div>
		<p class="donation__description">{message}</p>

		<div class="donation-buttons-wrapper">
			<Button
				icon="listAddItem"
				color={type === 'Twitch' ? 'white' : 'black'}
				shadowColor={type === 'Twitch' ? '#4b00bd' : '#F9A148'}
				on:click={(e) => handleAdd(e)}
			/>
			{#if mostSimilarLot}
				<Button
					icon="plus"
					color={type === 'Twitch' ? 'white' : 'black'}
					shadowColor={type === 'Twitch' ? '#4b00bd' : '#F9A148'}
					text={mostSimilarLot.title}
					on:click={handleAddSimilar}
				/>
			{/if}
			<Button
				icon="delete"
				color={type === 'Twitch' ? 'white' : 'black'}
				shadowColor={type === 'Twitch' ? '#4b00bd' : '#F9A148'}
				on:click={() => donations.remove(id)}
			/>
		</div>
	</div>
</div>

<style lang="scss">
	.donation {
		position: relative;
		z-index: 3;
		display: flex;
		flex-direction: column;
		padding: 20px;

		&-wrapper {
			position: relative;
			width: 375px;
			border-radius: 10px;
			transform: scale(1);
			box-shadow: 0 2px 4px black;
			line-height: 18px;
			transition: 0.2s;
			will-change: transform;
			user-select: none;
			cursor: grab;

			&.donation-alerts {
				color: black;
				background-color: var(--color-orange);

				&::before {
					background-image: url('/src/lib/assets/donationalerts_background.png');
				}
				&::after {
					background-color: var(--color-orange);
				}
				& .donation__description {
					text-shadow: 0px 3px 0px #f9a148;
				}
				& .donation__info p {
					text-shadow: 0px 3px 0px #f9a148;
				}
			}
			&.twitch {
				color: white;
				background-color: var(--color-purple);

				&::before {
					background-image: url('/src/lib/assets/twitch_background.png');
				}
				&::after {
					background-color: var(--color-purple);
				}
				& .donation__description {
					text-shadow: 0px 3px 0px #4b00bd;
				}
				& .donation__info p {
					text-shadow: 0px 3px 0px #4b00bd;
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
				border-radius: 10px;
				background-image: url('/src/lib/assets/donationalerts_background.png');
				background-position: center center;
				background-repeat: no-repeat;
				/* background-size: contain; */
			}

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				width: 100%;
				height: 100%;
				border-radius: 10px;
				background-color: var(--color-orange);
				opacity: 0.7;
				backdrop-filter: blur(6px);
			}

			&.dragged {
				filter: grayscale(1);
				opacity: 0.3;
				transition: none;
			}

			&:active {
				cursor: grabbing;
			}

			&:hover {
				transform: scale(1.05);
				box-shadow: 0 2px 10px black;
			}
		}

		&__description {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			text-shadow: 0px 2px 0px #f9a148;
			font-weight: 700;
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
				font-weight: 800;
				text-shadow: 0px 2px 0px #f9a148;
			}
		}
	}
</style>
