<script lang="ts">
	import Addlot from '$lib/components/Addlot.svelte';
	import WheelOfRandom from '$lib/components/WheelOfRandom.svelte';
</script>

<svelte:head>
	<title>Колесо - Аукцион</title>
</svelte:head>

<section class="wheel-section">
	<Addlot />
	<div style="display: flex; align-items: center; flex: 1 1 0;">
		<WheelOfRandom />
	</div>
</section>

<style lang="scss">
	.wheel-section {
		display: flex;
		flex-direction: column;
		justify-content: end;
		align-items: center;
		gap: 10px;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}
</style>
