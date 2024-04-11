<script lang="ts">
	export let title: string = '';
	export let icon: string = '';
</script>

<div class="titled-section">
	{#if icon || title}
		<div class="titled-section-head">
			{#if icon}
				<div class="icon-wrapper">
					<img src={icon} alt="" />
				</div>
			{/if}
			{#if title}
				<h3 class="medium-title">{title}</h3>
			{/if}
		</div>
	{/if}
	<div class="titled-section-inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.titled-section {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 0 20px;
		height: var(--titled-section-height, auto);
		overflow: var(--titled-section-overflow, unset);

		&-head {
			position: relative;
			display: flex;
			gap: 10px;
			align-items: center;
			justify-content: var(--titled-section-justify, start);

			// &::after {
			// 	content: '';
			// 	width: 100%;
			// 	height: 2px;
			// 	background-color: var(--outline-variant);
			// }
		}
		&-inner {
			display: flex;
			flex-direction: column;
			gap: var(--titled-section-gap, 10px);
			height: 100%;
			overflow: hidden auto;
		}
	}
</style>
