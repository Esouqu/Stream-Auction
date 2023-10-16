<script lang="ts">
	import WheelOfRandom from '$lib/components/WheelOfRandom.svelte';
	import lots from '$lib/stores/lots';
</script>

<svelte:head>
	<title>Колесо - Аукцион</title>
</svelte:head>

<section class="wheel-section">
	<WheelOfRandom items={$lots} />
</section>

<style lang="scss">
	.wheel-section {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: center;
		height: 100%;
		overflow: hidden;
	}
</style>
