<script lang="ts">
	export let isShown = false;
</script>

{#if isShown}
	<div class="popup">
		<slot />
	</div>
{/if}

<style lang="scss">
	.popup {
		position: absolute;
		top: 0;
		left: -110px;
		z-index: 99;
		padding: 20px;
		color: white;
		background-color: gray;
	}
</style>
