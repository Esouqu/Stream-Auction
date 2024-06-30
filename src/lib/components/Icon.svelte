<script lang="ts">
	export let src: string;
	export let iconSize = '30px';
</script>

<div class="icon-wrapper" style="--icon-size: {iconSize};">
	<img {src} alt="Icon" draggable="false" />
</div>

<style lang="scss">
	.icon-wrapper {
		display: flex;
		min-width: var(--icon-size, 30px);
		min-height: var(--icon-size, 30px);
		width: var(--icon-size, 30px);
		height: var(--icon-size, 30px);

		& img {
			width: 100%;
			object-fit: contain;
		}
	}
</style>
