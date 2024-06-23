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
	<title>Колесо - Вклиновый Аукцион</title>
</svelte:head>

<section class="wheel-section">
	<Wheel bind:winner />
	<div
		style="position: absolute; right: 20px; top: 25px; z-index: 999; display: flex; gap: 5px; align-items: center;"
	>
		<NumberInput
			id="spin-time"
			suffix="сек"
			label="Длительность"
			isFilled={true}
			isDisabled={$wheelState === WHEEL_STATE.SPINNING || $wheelState === WHEEL_STATE.DELAYED}
			bind:value={spinDuration}
		/>
		<div use:tooltip={{ content: 'Сгенерировать случайное число' }}>
			<Button
				icon="dice"
				iconColor="black"
				isFilled={true}
				isDisabled={$wheelState === WHEEL_STATE.SPINNING || $wheelState === WHEEL_STATE.DELAYED}
				on:click={() => {
					spinDuration = getRandomInRange($minSpinDuration, $maxSpinDuration);
				}}
			/>
		</div>
		{#if $wheelState === WHEEL_STATE.DELAYED || $wheelState === WHEEL_STATE.SPINNING}
			<div use:tooltip={{ content: 'Остановить' }}>
				<Button
					icon="stopCycle"
					iconColor="white"
					color="var(--error)"
					isFilled={true}
					on:click={() => {
						actionManager.stopWheelSpin();
						currentExtendSpinPrice.set($extendSpinAction.price);
					}}
				/>
			</div>
		{:else}
			<div use:tooltip={{ content: 'Крутить' }}>
				<Button
					icon="cycle"
					iconColor="black"
					isFilled={true}
					on:click={() => {
						actionManager.startWheelSpin(spinDuration * 1000);
						currentExtendSpinPrice.set($extendSpinAction.price);
					}}
				/>
			</div>
		{/if}

		<div use:tooltip={{ content: 'Удалить лот' }}>
			<Button
				icon="listRemoveItem"
				iconColor="white"
				color="var(--error)"
				isFilled={true}
				isDisabled={!winner ||
					$wheelState === WHEEL_STATE.SPINNING ||
					$wheelState === WHEEL_STATE.DELAYED}
				on:click={deleteWinner}
			/>
		</div>
		<div
			use:tooltip={{
				content:
					'Рекомедуется включить аппаратное ускорение в браузере для более плавной анимации колеса'
			}}
		>
			<Button icon="warning" iconColor="white" isInteractive={false} />
		</div>
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
</style>
