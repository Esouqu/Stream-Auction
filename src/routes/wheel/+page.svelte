<script lang="ts">
	import Wheel from '$lib/components/Wheel.svelte';
</script>

<svelte:head>
	<title>Колесо - Аукцион</title>
</svelte:head>

<section class="wheel-section">
	<Wheel />
</section>

<style lang="scss">
	.wheel-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		overflow: hidden;
	}
</style>
