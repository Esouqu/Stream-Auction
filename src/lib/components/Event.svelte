<script lang="ts">
	import getIcon from '$lib/icons';
	import type { EventType } from '$lib/interfaces';
	import events from '$lib/stores/events';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let id: number;
	export let message: string = '+60 сек. к таймеру';
	export let type: EventType = null;
	export let donationType: 'Twitch' | 'Donation Alerts';

	onMount(() => {
		setTimeout(() => {
			events.remove(id);
		}, 5000);
	});
</script>

<div
	class="event"
	class:twitch={donationType === 'Twitch'}
	class:donation-alerts={donationType === 'Donation Alerts'}
	in:fly={{ y: 100 }}
	out:fade
>
	<div class="event-inner-wrapper">
		{#if type}
			<div class="event-icon-wrapper">
				<img src={getIcon(type === 'add' ? 'plus' : 'upArrow')} alt="" />
			</div>
		{/if}
		<div class="event__message">{message}</div>
	</div>
</div>

<style lang="scss">
	.event {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 375px;
		border-radius: 10px;
		box-shadow: 0 2px 4px black;
		color: white;
		background-color: var(--color-orange);

		&.donation-alerts {
			background-color: var(--color-orange);
		}
		&.twitch {
			background-color: var(--color-purple);
		}

		&-inner-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: row;
			transition: 0.2s;
			user-select: none;
			padding: 10px 50px;
		}
		&__message {
			width: 100%;
			line-break: anywhere;
			font-size: 18px;
			font-weight: 700;
			text-overflow: ellipsis;
			overflow: hidden;
		}

		&-icon-wrapper {
			position: absolute;
			left: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
