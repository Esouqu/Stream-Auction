<script lang="ts">
	export let options: { title: string; value: string }[] = [];
	export let currentOption = options[0].value;
	export let onOptionChange: ((optionValue: string) => void) | null = null;

	function setOption(optionValue: string) {
		currentOption = optionValue;

		if (onOptionChange) onOptionChange(optionValue);
	}
</script>

<div class="button-select">
	{#each options as option}
		<button
			type="button"
			class:selected={option.value === currentOption}
			on:click={() => setOption(option.value)}>{option.title}</button
		>
	{/each}
</div>

<style lang="scss">
	.button-select {
		display: flex;
		gap: 10px;
		border-radius: 8px;
		padding: 5px;
		background-color: var(--surface-container-low);

		button {
			border: none;
			padding: 5px 10px;
			width: 100%;
			color: var(--on-surface);
			background-color: transparent;
			opacity: 0.5;
			transition: opacity 0.2s;
			cursor: pointer;

			&.selected {
				border-radius: 8px;
				font-weight: 500;
				opacity: 1;
				color: var(--on-surface);
				background-color: var(--primary-50);
				pointer-events: none;
			}

			&:hover {
				opacity: 1;
			}
		}
	}
</style>
