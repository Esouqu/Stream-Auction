<script lang="ts">
	import backgroundImage from '$lib/stores/backgroundImage';
	import transparency from '$lib/stores/transparency';

	export let title: string = '';

	$: isTransparent = !!$backgroundImage;
</script>

<div
	class="card"
	class:transparent={isTransparent}
	class:titless={!title}
	style="--card-opacity: {$transparency};"
>
	{#if title}
		<h3 class="card__title">
			{title}
		</h3>
	{/if}
	<div class="card-inner">
		<slot />
	</div>
</div>

<style lang="scss">
	.card {
		position: relative;
		display: flex;
		flex: var(--card-flex, 0 1 auto);
		flex-direction: column;
		min-width: var(--card-min-w, auto);
		width: var(--card-w, auto);
		box-shadow: var(--elevation-5);
		overflow: hidden;

		&.titless .card-inner {
			padding: 20px;
		}

		&__title {
			z-index: 2;
			line-height: 1;
			font-size: var(--card-title-size, 18px);
			font-weight: bold;
			text-align: center;
			margin: 20px 0 10px;
		}

		&-inner {
			position: relative;
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: var(--card-justify, start);
			align-items: var(--card-align, center);
			gap: var(--card-gap, 0);
			padding: var(--card-p, 10px 20px 20px);
			scrollbar-gutter: stable;
			overflow: var(--card-flow, unset);
		}

		&.transparent::before {
			opacity: var(--card-opacity);
		}

		&::before {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background-color: var(--surface);
		}
	}
</style>
