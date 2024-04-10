<script lang="ts">
	import tooltip from '$lib/actions/tooltip';
	import ActionPanel from '$lib/components/ActionPanel.svelte';
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

	let spinDuration = 10;
	let winner: IPieItem | null;

	$: wheelState = wheel.state;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;
	$: extendSpinAction = settings.extendSpinAction;
	$: minSpinDuration = settings.minSpinDuration;
	$: maxSpinDuration = settings.maxSpinDuration;

	function deleteWinner() {
		if (!winner) return;

		lots.remove(winner.id);
		wheel.state.set(WHEEL_STATE.IDLE);
		winner = null;
	}
</script>

<svelte:head>
	<title>Колесо - Аукцион</title>
</svelte:head>

<section class="wheel-section">
	<Wheel bind:winner />
	<ActionPanel>
		<NumberInput
			id="spin-time"
			suffix="сек"
			label="Длительность"
			isDisabled={$wheelState === WHEEL_STATE.SPINNING || $wheelState === WHEEL_STATE.DELAYED}
			bind:value={spinDuration}
		/>
		<Button
			icon="cycle"
			iconColor="black"
			title="Ролл"
			isFilled={true}
			isDisabled={$wheelState === WHEEL_STATE.SPINNING || $wheelState === WHEEL_STATE.DELAYED}
			on:click={() => {
				actionManager.startWheelSpin(spinDuration * 1000);
				currentExtendSpinPrice.set($extendSpinAction.price);
			}}
		/>
		<Button
			icon="dice"
			iconColor="black"
			title="Сгенерировать случайное число"
			isFilled={true}
			isDisabled={$wheelState === WHEEL_STATE.SPINNING || $wheelState === WHEEL_STATE.DELAYED}
			on:click={() => {
				spinDuration = getRandomInRange($minSpinDuration, $maxSpinDuration);
			}}
		/>
		<Button
			icon="listRemoveItem"
			iconColor="white"
			color="var(--error)"
			title="Удалить текущий лот"
			isFilled={true}
			isDisabled={!winner ||
				$wheelState === WHEEL_STATE.SPINNING ||
				$wheelState === WHEEL_STATE.DELAYED}
			on:click={deleteWinner}
		/>
		<div
			use:tooltip={{
				content: 'Рекомедуется включить аппаратное ускорение для более плавной анимации колеса',
				placement: 'top'
			}}
		>
			<Button icon="warning" iconColor="white" isInteractive={false} />
		</div>
	</ActionPanel>
</section>

<style lang="scss">
	.wheel-section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		overflow: hidden;
	}
</style>
