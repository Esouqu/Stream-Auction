<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import Setting from '$lib/components/Setting.svelte';
	import Textarea from '$lib/components/Textarea.svelte';
	import {
		stopSpin,
		addTimeOnNewItem,
		addTimeOnNewLeader,
		textRules,
		timerStarterTime,
		additionSpinTime,
		additionSpinTimePrice,
		additionSpinTimePriceStep
	} from '$lib/stores/settings';
	import timer from '$lib/stores/timer';
	import wheel from '$lib/stores/wheel';
	import { slide } from 'svelte/transition';

	// $: timer.setInitialTime($timerStarterTime.value * 1000 * 60);
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<!-- <Dropdown options={presets} /> -->
	<Textarea id="rules-setting" bind:value={$textRules} placeholder="Мои правила аукциона" />
	<div class="toggles-wrapper">
		<div class="toggles toggles_wheel">
			<Setting
				id={0}
				description={$stopSpin.description}
				bind:isToggled={$stopSpin.isToggled}
				bind:value={$stopSpin.value}
			/>
			<Setting
				id={1}
				description={$additionSpinTime.description}
				bind:isToggled={$additionSpinTime.isToggled}
				bind:value={$additionSpinTime.value}
			/>
			{#if $additionSpinTime.isToggled}
				<div
					style="display: flex; flex-direction: column; gap: 10px; padding-left: 15px;"
					transition:slide={{ duration: 200, axis: 'y' }}
				>
					<Setting
						id={2}
						description={$additionSpinTimePrice.description}
						bind:value={$additionSpinTimePrice.value}
					/>
					<Setting
						id={3}
						description={$additionSpinTimePriceStep.description}
						bind:value={$additionSpinTimePriceStep.value}
					/>
				</div>
			{/if}
		</div>
		<div class="toggles toggles_timer">
			<Setting
				id={4}
				description={$timerStarterTime.description}
				bind:isToggled={$timerStarterTime.isToggled}
				bind:value={$timerStarterTime.value}
				isDisabled={$wheel.isSpinning}
				callback={() => timer.setInitialTime($timerStarterTime.value * 1000 * 60)}
			/>
			<Setting
				id={5}
				description={$addTimeOnNewItem.description}
				bind:isToggled={$addTimeOnNewItem.isToggled}
				bind:value={$addTimeOnNewItem.value}
			/>
			<Setting
				id={6}
				description={$addTimeOnNewLeader.description}
				bind:isToggled={$addTimeOnNewLeader.isToggled}
				bind:value={$addTimeOnNewLeader.value}
			/>
		</div>
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
		gap: 30px;
	}
	.toggles {
		display: flex;
		flex-direction: column;
		gap: 10px;

		&::before {
			content: '';
			margin: 8px 0;
			font-size: 24px;
			font-weight: 600;
		}

		&_wheel::before {
			content: 'Колесо';
		}
		&_timer::before {
			content: 'Таймер';
		}
	}
</style>
