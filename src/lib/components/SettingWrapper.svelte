<script lang="ts">
	export let title: string;
	export let description: string = '';
	export let isVertical = false;
	export let isAdditional = false;
	export let isDisabled = false;
</script>

<div
	class="setting-wrapper"
	class:vertical={isVertical}
	class:additional={isAdditional}
	class:disabled={isDisabled}
>
	<div style="display: flex; flex-direction: column; width: 100%;">
		<p class="default-title">{title}</p>
		{#if description}
			<p class="support-text">{description}</p>
		{/if}
	</div>
	<div class="setting-wrapper-inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.setting-wrapper {
		display: flex;
		gap: 20px;

		&:not(:first-child) {
			align-items: center;
			font-size: 14px;
		}

		&.disabled {
			opacity: 0.5;
			pointer-events: none;
		}

		&.vertical {
			flex-direction: column;
			gap: 10px;

			& .setting-wrapper-inner {
				width: 100%;
			}
		}

		&.additional {
			justify-content: space-between;
		}

		&-inner {
			display: flex;
			flex-direction: column;
			gap: 10px;
		}
	}
</style>
