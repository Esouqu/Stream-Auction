<script lang="ts">
	export let id: number;
	export let title: string;
	export let color: string;
	export let percent: number;
</script>

<div class="lot-preview" data-lot-id="#{id}">
	<div class="lot-preview__id" style="--lot-id-color: {color};">
		#{id}
	</div>
	<div style="display: grid; width: 100%;">
		<div class="lot-preview__title">{title}</div>
	</div>
	<div class="lot-preview__percent">{Number(percent.toFixed(1))}%</div>
</div>

<style lang="scss">
	.lot-preview {
		display: flex;
		align-items: center;
		width: 100%;

		&__title {
			z-index: 0;
			padding: 10px;
			width: 100%;
			text-overflow: ellipsis;
			white-space: nowrap;
			letter-spacing: 0.25px;
			overflow: hidden;
		}

		&__id {
			position: relative;
			display: flex;
			z-index: 1;
			align-items: center;
			justify-content: center;
			margin-right: 10px;
			min-width: 60px;
			height: 100%;
			font-weight: 500;
			color: white;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: -1;
				width: 100%;
				height: 100%;
				background-color: var(--lot-id-color, transparent);
				opacity: 0.4;
			}
		}

		&__percent {
			z-index: 0;
			display: flex;
			align-self: center;
			justify-content: center;
			padding: 0 10.5px;
			min-width: 90px;
			font-variant-numeric: tabular-nums;
			letter-spacing: 0.25px;
		}
	}
</style>
