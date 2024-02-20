<script lang="ts">
	import { fade } from 'svelte/transition';
	import lots from '$lib/stores/lots';
	import Addlot from '$lib/components/Addlot.svelte';
	import VirtualList from '$lib/components/VirtualList.svelte';
	import Help from '$lib/components/Help.svelte';
</script>

<svelte:head>
	<title>Лоты - Аукцион</title>
</svelte:head>

<section class="auction-section">
	<div class="add-lot-wrapper">
		<Addlot />
		<div style="position: absolute; right: 20px; width: 100%; text-align: end;">
			<Help
				placement="left-end"
				content={'Переходя на другие страницы, кручение колеса продолжится. Таким образом вы можете добавлять/изменять/удалять лоты переходя на страницу с лотами или менять настройки на странице настроек не прерывая кручения колеса.\n\nПресеты правил и настройки на странице настроек сохраняются до очищения кэша браузера.\n\nВНИМАНИЕ: Лоты не сохраняются!'}
			/>
		</div>
	</div>
	<div class="virtual-list-wrapper">
		<VirtualList />
		{#if $lots.length < 1}
			<div class="no-lots" transition:fade>
				<p>Лоты отсутствуют</p>
			</div>
		{/if}
	</div>
</section>

<style lang="scss">
	.virtual-list-wrapper {
		position: relative;
		display: flex;
		flex: 1 1 0;
		flex-direction: column;
		overflow: hidden;
	}
	.add-lot-wrapper {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 26px;
	}
	.auction-section {
		display: flex;
		flex-direction: column;
		gap: 20px;
		width: 100%;
	}
	.no-lots {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1 1 0;
		width: 100%;
		height: 100%;
		font-size: 24px;
	}
</style>
