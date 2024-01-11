<script lang="ts">
	import { fly } from 'svelte/transition';

	export let trigger: unknown;
</script>

<div class="transition-container">
	{#key trigger}
		<div class="transition-container__item" in:fly={{ y: 20 }} out:fly={{ y: -20 }}>
			<slot />
		</div>
	{/key}
</div>

<style lang="scss">
	.transition-container {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
		width: 100%;
		overflow: hidden;

		&__item {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			grid-row: 1;
			grid-column: 1;
		}
	}
</style>
