<script lang="ts">
	import settings from '$lib/stores/settings';
	import Navigation from './Navigation.svelte';

	$: transparency = settings.transparency;
</script>

<div class="action-panel" style="--action-panel-opacity: {$transparency};">
	<Navigation />
	<div style="z-index: 0; display: flex; gap: 5px;">
		<slot />
	</div>
</div>

<style lang="scss">
	.action-panel {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 5px;
		border-radius: 10px 10px 0 0;
		padding: 20px;
		height: fit-content;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--surface-container);
			opacity: var(--action-panel-opacity, 1);
		}
	}
</style>
