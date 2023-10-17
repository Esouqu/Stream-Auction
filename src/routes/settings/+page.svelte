<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Setting from '$lib/components/Setting.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import {
		stopWheelOnDonation,
		addTimeOnNewItem,
		addTimeOnNewLeader,
		textRules,
		timerStarterTime
	} from '$lib/stores/settings';
	import timer from '$lib/stores/timer';

	let presets: string[] = ['По умолчанию'];

	// 'Колесный Киноаукцион', 'Аук на все', 'Самарский'
	// $: console.log($stopWheelOnDonation);
	// $: console.log($addTimeOnNewItem);
	// $: console.log($addTimeOnNewLeader);
	// $: console.log($timerStarterTime.isToggled);
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<Dropdown options={presets} />

	<Textarea id="rules-setting" bind:value={$textRules} />
	<div class="toggles-wrapper">
		<Setting
			id={1}
			bind:isToggled={$stopWheelOnDonation.isToggled}
			bind:value={$stopWheelOnDonation.value}
			description={$stopWheelOnDonation.description}
			valueKey={$stopWheelOnDonation.valueAttribute}
		/>
		<Setting
			id={2}
			bind:isToggled={$addTimeOnNewItem.isToggled}
			bind:value={$addTimeOnNewItem.value}
			description={$addTimeOnNewItem.description}
			valueKey={$addTimeOnNewItem.valueAttribute}
		/>
		<Setting
			id={3}
			bind:isToggled={$addTimeOnNewLeader.isToggled}
			bind:value={$addTimeOnNewLeader.value}
			description={$addTimeOnNewLeader.description}
			valueKey={$addTimeOnNewLeader.valueAttribute}
		/>
		<Setting
			id={4}
			bind:isToggled={$timerStarterTime.isToggled}
			bind:value={$timerStarterTime.value}
			description={$timerStarterTime.description}
			valueKey={$timerStarterTime.valueAttribute}
			callback={() => timer.setStarterTime(Number($timerStarterTime.value))}
		/>
	</div>
</section>

<style lang="scss">
	.settings-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		gap: 20px;
		padding: 30px;
	}
	.toggles-wrapper {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
</style>
