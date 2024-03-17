<script lang="ts">
	import { slide } from 'svelte/transition';
	import timer from '$lib/stores/timer';
	import Setting from '$lib/components/Setting.svelte';
	import RangeSlider from '$lib/components/RangeSlider.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import Help from '$lib/components/Help.svelte';
	import SelectButton from '$lib/components/SelectButton.svelte';
	import settings from '$lib/stores/settings';
	import { TIMER_STATE } from '$lib/constants';

	let options = ['Картинка', 'Видео'];

	$: continueSpinAction = settings.extendSpinAction;
	$: stopSpinAction = settings.stopSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;
	$: timerBaseTime = settings.timerBaseTime;
	$: itemAddedAction = settings.itemAddedAction;
	$: leaderChangedAction = settings.leaderChangedAction;
	$: intensity = settings.intensity;
	$: timerState = timer.state;
	$: background = settings.background;
	$: backgroundTransparency = settings.transparency;
	$: wheelWinnerDelay = settings.wheelWinnerDelay;
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<div class="toggles-wrapper">
		<div class="toggles toggles_bg">
			<div class="bg-setting">
				<p>Тип</p>
				<SelectButton
					{options}
					bind:selectedOption={$background.type}
					on:selectionChanged={() => settings.resetBackground()}
				/>
			</div>
			<div class="bg-setting">
				<p>Ссылка</p>
				<Help content="Динамический фон можно взять тут: https://backgrounds.gallery/animated" />
				<Input
					--input-w="100%"
					--input-w-w="100%"
					id="video-url"
					type="text"
					placeholder="Ссылка на файл"
					bind:value={$background.url}
				/>
			</div>
			<div class="bg-setting">
				<p>Прозрачность интерфейса</p>
				<div style="display: flex; align-items: center;">
					<RangeSlider min={0.1} max={1} step={0.05} bind:value={$backgroundTransparency} />
					<span style="width: 50px; text-align: end;">{$backgroundTransparency}</span>
				</div>
			</div>
			<Setting
				id="flame"
				description="Жаришка нереальная"
				help="С каждым донатом, который равен или выше заданного значения, увеличивается огонь на заднем фоне. Огонь постепенно уменьшается"
				suffix="Руб"
				bind:isToggled={$intensity.isEnabled}
				bind:value={$intensity.price}
			/>
			<div style="margin-top: 20px;">
				<TextButton
					--text-b-fs="14px"
					text="Убрать Фон"
					on:click={() => settings.resetBackground()}
				/>
			</div>
		</div>
		<div class="toggles toggles_timer">
			<Setting
				id="timer-1"
				description="Стартовое время"
				suffix="Мин"
				isDisabled={$timerState === TIMER_STATE.RUNNING}
				haveToggle={false}
				bind:value={$timerBaseTime}
			/>
			<Setting
				id="timer-2"
				description="Добавлять время за новый лот"
				suffix="Сек"
				bind:isToggled={$itemAddedAction.isEnabled}
				bind:value={$itemAddedAction.seconds}
			/>
			<Setting
				id="timer-3"
				description="Добавлять время за смену лидера"
				suffix="Сек"
				bind:isToggled={$leaderChangedAction.isEnabled}
				bind:value={$leaderChangedAction.seconds}
			/>
		</div>
		<div class="toggles toggles_wheel">
			<Setting
				id="wheel-6"
				description="Задержка"
				help="Определение победителя будет отложенно на указанное значение"
				suffix="Сек"
				bind:isToggled={$wheelWinnerDelay.isEnabled}
				bind:value={$wheelWinnerDelay.seconds}
			/>
			<Setting
				id="wheel-2"
				description="Остановить, добавив вариант"
				help="Если донат равен или превышает заданное значение, останавливает колесо на текущей позиции и добавляет/обновляет вариант из доната"
				suffix="Руб"
				bind:isToggled={$stopSpinAction.isEnabled}
				bind:value={$stopSpinAction.price}
			/>
			<Setting
				id="wheel-3"
				description="Продливать кручение"
				help="Если донат равен или превышает заданное значение, продлевает кручение колеса и добавляет/обновляет вариант из доната"
				suffix="Руб"
				onInput={() => currentExtendSpinPrice.set($continueSpinAction.price)}
				bind:isToggled={$continueSpinAction.isEnabled}
				bind:value={$continueSpinAction.price}
			/>
			{#if $continueSpinAction.isEnabled}
				<div class="toggles-options" transition:slide={{ duration: 200, axis: 'y' }}>
					<Setting
						id="wheel-4"
						description="Длительность продления"
						help="Значение, на которое продлится кручение"
						suffix="Сек"
						haveToggle={false}
						bind:value={$continueSpinAction.seconds}
					/>
					<Setting
						id="wheel-5"
						description="Увеличениe минимальной суммы за донат"
						help="Значение, добавляемое к сумме продления, за каждый донат выше минимума"
						suffix="Руб"
						haveToggle={false}
						bind:value={$continueSpinAction.step}
					/>
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.settings-section {
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 0 30px;
		scrollbar-gutter: stable;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.bg-setting {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	.toggles-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.toggles {
		display: flex;
		flex-direction: column;

		&-options {
			position: relative;
			display: flex;
			flex-direction: column;
			padding-left: 15px;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 5px;
				width: 3px;
				height: 100%;
				border-radius: 10px;
				background-color: var(--primary-70);
			}
		}

		&::before {
			content: '';
			margin: 8px 0;
			font-size: 20px;
			font-weight: 600;
		}

		&_wheel::before {
			content: 'Колесо';
		}
		&_timer::before {
			content: 'Таймер';
		}
		&_bg {
			&::before {
				content: 'Фон';
			}
		}
	}
</style>
