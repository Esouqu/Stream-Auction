<script lang="ts">
</script>

<div class="snackbar">
	<div class="snackbar-inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.snackbar {
		position: relative;
		display: flex;
		flex-direction: column;
		border-radius: 5px;
		width: 100%;
		box-shadow: var(--elevation-3);
		font-size: 18px;
		font-weight: 600;
		overflow: hidden;
		background-color: var(--primary-container);

		&-inner {
			display: grid;
			grid-template-columns: 1fr auto;
			align-items: center;
			gap: 20px;
			padding: 10px;
		}

		/* &:not(:last-child)::after {
			content: '';
			width: 100%;
			height: 1px;
			background-color: var(--outline-variant);
		} */
	}
</style>
