<script lang="ts">
	export let id: number;
	export let title: string;
	export let color: string;
	export let contrastColor: string;
	export let percent: number;
</script>

<div class="lot-preview" data-lot-id="#{id}">
	<span class="lot-preview__id" style="color: {contrastColor}; background-color: {color};">
		#{id}
	</span>
	<span class="lot-preview__title">{title}</span>
	<span class="lot-preview__percent">{Number(percent.toFixed(1))}%</span>
</div>

<style lang="scss">
	.lot-preview {
		display: flex;
		align-items: center;
		padding: 5px 0;

		&__id {
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 5px;
			min-width: 60px;
			height: 30px;
			font-weight: bold;
		}

		&__title {
			padding: 10px;
			border-radius: 100px;
			width: 100%;
			text-overflow: ellipsis;
			overflow: hidden;
		}
	}
</style>
