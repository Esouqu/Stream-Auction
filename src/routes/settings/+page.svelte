<script lang="ts">
	import Dropdown from '$lib/components/Dropdown.svelte';
	import Setting from '$lib/components/Setting.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import lots from '$lib/stores/lots';
	import {
		stopWheelOnDonation,
		addTimeOnNewItem,
		addTimeOnNewLeader,
		textRules,
		timerStarterTime,
		addWheelSpinTimeOnDonation
	} from '$lib/stores/settings';
	import timer from '$lib/stores/timer';

	let presets: string[] = ['По умолчанию'];
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<!-- <Dropdown options={presets} />

	<Textarea id="rules-setting" bind:value={$textRules} /> -->
	<div class="toggles-wrapper">
		<Setting
			id={1}
			bind:isToggled={$stopWheelOnDonation.isToggled}
			bind:value={$stopWheelOnDonation.value}
			description={$stopWheelOnDonation.description}
			valueKey={$stopWheelOnDonation.valueAttribute}
			isDisabled={true}
		/>
		<Setting
			id={2}
			bind:isToggled={$addWheelSpinTimeOnDonation.isToggled}
			bind:value={$addWheelSpinTimeOnDonation.value}
			description={$addWheelSpinTimeOnDonation.description}
			valueKey={$addWheelSpinTimeOnDonation.valueAttribute}
		/>
		<Setting
			id={3}
			bind:isToggled={$addTimeOnNewItem.isToggled}
			bind:value={$addTimeOnNewItem.value}
			description={$addTimeOnNewItem.description}
			valueKey={$addTimeOnNewItem.valueAttribute}
		/>
		<Setting
			id={4}
			bind:isToggled={$addTimeOnNewLeader.isToggled}
			bind:value={$addTimeOnNewLeader.value}
			description={$addTimeOnNewLeader.description}
			valueKey={$addTimeOnNewLeader.valueAttribute}
		/>
		<Setting
			id={5}
			bind:isToggled={$timerStarterTime.isToggled}
			bind:value={$timerStarterTime.value}
			description={$timerStarterTime.description}
			valueKey={$timerStarterTime.valueAttribute}
			callback={() => timer.setInitialTime(Number($timerStarterTime.value) * 1000 * 60)}
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
