<script lang="ts">
	import tooltip from '$lib/actions/tooltip';
	import Button from '$lib/components/Button.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import Wheel from '$lib/components/Wheel.svelte';
	import { WHEEL_STATE } from '$lib/constants';
	import type { IPieItem } from '$lib/interfaces';
	import actionManager from '$lib/stores/actionManager';
	import lots from '$lib/stores/lots';
	import settings from '$lib/stores/settings';
	import wheel from '$lib/stores/wheel';
	import { getRandomInRange } from '$lib/utils';
	import Popup from '$lib/components/Popup.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import warningIcon from '$lib/assets/warning_icon.svg';
	import stopCycleIconBlack from '$lib/assets/stop_cycle_icon_black.svg';
	import cycleIconBlack from '$lib/assets/cycle_icon_black.svg';
	import diceIconBlack from '$lib/assets/dice_icon_black.svg';
	import listRemoveItemBlack from '$lib/assets/list_remove_icon_black.svg';
	import { page } from '$app/stores';
	import visitApi from '$lib/visitManager';

	let spinDuration = 10;
	let winner: IPieItem | null;

	$: wheelState = wheel.state;
	$: minSpinDuration = settings.minSpinDuration;
	$: maxSpinDuration = settings.maxSpinDuration;

	$: isWheelActive = $wheelState === WHEEL_STATE.DELAYED || $wheelState === WHEEL_STATE.SPINNING;

	function setRandomDuration() {
		spinDuration = getRandomInRange($minSpinDuration, $maxSpinDuration);
	}

	function deleteWinner() {
		if (!winner) return;

		lots.remove(winner.id);
		wheel.state.set(WHEEL_STATE.IDLE);
		winner = null;
	}
</script>

<svelte:head>
	<title>Колесо - Вклиновый Аукцион</title>
</svelte:head>

<Popup
	width="200px"
	isOpened={!$page.data.haveSeenWarning}
	onClose={() => visitApi.setLastSeenWarning()}
>
	<div style="display: flex; flex-direction: column; align-items: center;">
		<Icon src={warningIcon} />
		<h4 style="text-align: center;">
			Рекомедуется включить аппаратное ускорение в браузере для более плавной анимации колеса.<br />
			Варианты сохранятся при перезагрузке страницы.
		</h4>
	</div>
</Popup>

<section class="wheel-section">
	<Wheel bind:winner />
	<div class="action-buttons-wrapper">
		<div class="spin-duration-wrapper" class:disabled={isWheelActive}>
			<Button
				--button-border-radius="8px 0 0 8px"
				icon={diceIconBlack}
				color="transparent"
				hoverColor="black"
				tooltipProps={{ content: 'Сгенерировать число' }}
				on:click={setRandomDuration}
			/>
			<div use:tooltip={{ content: 'Длительность' }}>
				<NumberInput
					--input-w-w="90px"
					--input-w="auto"
					id="spin-time"
					suffix="сек"
					isBlack={true}
					isBorderless={true}
					bind:value={spinDuration}
				/>
			</div>
		</div>
		{#if isWheelActive}
			<Button
				icon={stopCycleIconBlack}
				tooltipProps={{ content: 'Остановить' }}
				on:click={() => actionManager.stopWheelSpin()}
			/>
		{:else}
			<Button
				icon={cycleIconBlack}
				tooltipProps={{ content: 'Крутить' }}
				on:click={() => actionManager.startWheelSpin(spinDuration * 1000)}
			/>
		{/if}
		<Button
			icon={listRemoveItemBlack}
			isDisabled={!winner || isWheelActive}
			tooltipProps={{ content: 'Удалить победителя' }}
			on:click={deleteWinner}
		/>
	</div>
</section>

<style lang="scss">
	.wheel-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		overflow: hidden;
	}
	.action-buttons-wrapper {
		position: absolute;
		right: 20px;
		top: 25px;
		z-index: 999;
		display: flex;
		gap: 5px;
		align-items: center;
	}
	.spin-duration-wrapper {
		display: flex;
		align-items: center;
		border-radius: 8px;
		color: var(--on-inverse-surface);
		background-color: var(--inverse-surface);
		overflow: hidden;

		&.disabled {
			opacity: 0.3;
			pointer-events: none;
		}
	}
</style>
