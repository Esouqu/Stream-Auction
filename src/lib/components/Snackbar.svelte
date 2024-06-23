<script lang="ts">
	import settings from '$lib/stores/settings';

	export let isDisabled = false;

	$: transparency = settings.transparency;
</script>

<div class="snackbar" class:disabled={isDisabled} style="--snackbar-opacity: {$transparency};">
	<div class="snackbar-inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.snackbar {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: var(--snackbar-justify, auto);
		border-radius: 5px;
		width: 100%;
		box-shadow: var(--elevation-1);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		overflow: hidden;

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			opacity: var(--snackbar-opacity, 1);
			background-color: var(--surface-bright);
		}

		&-inner {
			z-index: 0;
			display: flex;
			flex-direction: column;
			gap: 15px;
			padding: var(--snackbar-p, 20px);
		}
	}
</style>
