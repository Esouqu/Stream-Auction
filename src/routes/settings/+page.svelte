<script lang="ts">
	import Settings from '$lib/components/Settings.svelte';
</script>

<svelte:head>
	<title>Настройки - Вклиновый Аукцион</title>
</svelte:head>

<section class="settings-section">
	<Settings />
</section>

<style lang="scss">
	.settings-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 20px;
		width: 100%;
		overflow: hidden auto;
	}
</style>
