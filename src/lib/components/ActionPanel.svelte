<script lang="ts">
	import Navigation from './Navigation.svelte';
</script>

<div class="action-panel">
	<Navigation />
	<div style="z-index: 0; display: flex; gap: 5px;">
		<slot />
	</div>
</div>

<style lang="scss">
	.action-panel {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		padding: 20px;
		height: fit-content;

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 0 0 10px 10px;
			width: 100%;
			height: 100%;
		}
	}
</style>
