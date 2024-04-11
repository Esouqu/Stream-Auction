<script lang="ts">
	import Settings from '$lib/components/Settings.svelte';
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<Settings />
</section>

<style lang="scss">
	.settings-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		width: 100%;
		margin-top: 20px;
		overflow: hidden auto;
	}
</style>
