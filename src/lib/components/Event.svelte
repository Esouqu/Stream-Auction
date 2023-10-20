<script lang="ts">
	import getIcon from '$lib/icons';
	import type { eventTypes } from '$lib/interfaces';
	import events from '$lib/stores/events';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let id: number;
	export let message: string = '+60 сек. к таймеру';
	export let type: eventTypes = null;

	onMount(() => {
		setTimeout(() => {
			events.remove(id);
		}, 5000);
	});
</script>

<div class="event" in:fly={{ y: 100 }} out:fade>
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
		background-color: var(--color-orange);

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
