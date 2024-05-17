<script lang="ts">
	import Navigation from './Navigation.svelte';
</script>

<div class="action-panel" />

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
