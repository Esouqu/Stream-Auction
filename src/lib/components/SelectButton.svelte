<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface ISplitButtonEvents {
		selectionChanged: {
			selectedOption: string;
		};
	}

	const dispatch = createEventDispatcher<ISplitButtonEvents>();

	export let options: string[] = [];
	export let selectedOption = options[0];

	function handleButtonClick(option: string) {
		selectedOption = option;

		dispatch('selectionChanged', { selectedOption });
	}
</script>

<div class="split-button">
	{#each options as option}
		<button
			type="button"
			class="split-button__button"
			class:selected={selectedOption === option}
			on:click={() => handleButtonClick(option)}
		>
			{option}
		</button>
	{/each}
</div>

<style lang="scss">
	.split-button {
		display: flex;
		flex-direction: row;
		gap: 5px;
		padding: 3px 5px;
		border-radius: 10px;
		background-color: var(--neutral);

		&__button {
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10px;
			translate: 0 0;
			padding: 5px;
			border: 0;
			border-radius: 10px;
			line-height: 1;
			opacity: 0.7;
			color: var(--on-surface);
			background-color: transparent;
			transition: 0.2s;
			user-select: none;
			cursor: default;

			&.selected {
				opacity: 1;
				color: var(--on-inverse-surface);
				background-color: var(--inverse-surface);
			}

			&:not(.selected) {
				cursor: pointer;

				&:hover {
					opacity: 1;
				}
			}
		}
	}
</style>
