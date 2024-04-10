<script lang="ts">
	export let options: string[];
	export let currentTab: number = 0;
</script>

<div class="tabs">
	{#each options as title, idx}
		<button
			type="button"
			class="tabs__tab default-title"
			class:selected={currentTab === idx}
			on:click={() => (currentTab = idx)}>{title}</button
		>
	{/each}
</div>

<style lang="scss">
	.tabs {
		position: relative;
		display: flex;
		width: 100%;

		&::before {
			content: '';
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 1px;
			background-color: var(--neutral);
		}
		&__tab {
			position: relative;
			padding: 15px 0;
			border: 0;
			width: 100%;
			font-weight: 500;
			color: var(--on-surface);
			background-color: transparent;
			opacity: 0.7;
			transition: 0.2s;
			cursor: pointer;

			&:hover:not(.selected) {
				opacity: 1;
			}

			&.selected {
				opacity: 1;
				pointer-events: none;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					// translate: -50% 0;
					width: 100%;
					height: 2px;
					background-color: var(--on-surface);
				}
			}
		}
	}
</style>
