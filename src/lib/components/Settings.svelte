<script lang="ts">
	import timer from '$lib/stores/timer';
	import Slider from '$lib/components/Slider.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import settings from '$lib/stores/settings';
	import { TIMER_STATE } from '$lib/constants';
	import TitledSection from './TitledSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';
	import Snackbar from './Snackbar.svelte';
	import Switch from './Switch.svelte';
	import NumberInput from './NumberInput.svelte';
	import { isVideoOrImage } from '$lib/utils';
	import RangeSlider from './RangeSlider.svelte';

	let errorText: string = '';
	let bgUrl: string;

	$: minSpinDuration = settings.minSpinDuration;
	$: maxSpinDuration = settings.maxSpinDuration;
	$: timerBaseTime = settings.timerBaseTime;
	$: itemAddedAction = settings.itemAddedAction;
	$: leaderChangedAction = settings.leaderChangedAction;
	$: timerState = timer.state;
	$: background = settings.background;
	$: backgroundTransparency = settings.transparency;

	function setBackgroundImageOrVideo() {
		const type = isVideoOrImage(bgUrl);

		if (!type) {
			errorText = 'Некорректная ссылка';
			return;
		}

		errorText = '';
		settings.setBackgroundType(type);
		$background.url = bgUrl;
	}
</script>

<div class="settings-wrapper">
	<TitledSection title="Таймер">
		<div class="settings-row">
			<div class="settings-column">
				<Snackbar>
					<SettingWrapper
						title="Стартовое время"
						description={`Базовое значение, с которого будет отсчитываться таймер.\nТакже, на это значение таймер будет возвращаться при сбросе`}
					>
						<NumberInput
							id="timer-1"
							suffix="мин"
							placeholder="Значение"
							isDisabled={$timerState === TIMER_STATE.RUNNING}
							bind:value={$timerBaseTime}
						/>
					</SettingWrapper>
				</Snackbar>
				<Snackbar>
					<SettingWrapper title="Добавлять время за новый вариант">
						<Switch bind:isToggled={$itemAddedAction.isEnabled} />
					</SettingWrapper>
					<SettingWrapper title="Доп. время" isDisabled={!$itemAddedAction.isEnabled}>
						<NumberInput
							id="timer-2"
							suffix="сек"
							placeholder="Значение"
							bind:value={$itemAddedAction.seconds}
						/>
					</SettingWrapper>
				</Snackbar>
			</div>
			<div class="settings-column">
				<Snackbar>
					<SettingWrapper title="Добавлять время за смену лидера">
						<Switch bind:isToggled={$leaderChangedAction.isEnabled} />
					</SettingWrapper>
					<SettingWrapper title="Доп. время" isDisabled={!$leaderChangedAction.isEnabled}>
						<NumberInput
							id="timer-3"
							suffix="сек"
							placeholder="Значение"
							bind:value={$leaderChangedAction.seconds}
						/>
					</SettingWrapper>
				</Snackbar>
			</div>
		</div>
	</TitledSection>
	<TitledSection title="Колесо">
		<div class="settings-row">
			<div class="settings-column">
				<Snackbar>
					<SettingWrapper
						title="Диапазон случайного числа"
						description="Диапазон в котором генерируется случайное число по нажатию кнопки генерации"
					>
						<div style="text-wrap: nowrap; min-width: 55px; text-align: center;">
							От {$minSpinDuration}
						</div>
						<div style="text-wrap: nowrap; min-width: 55px; text-align: center;">
							До {$maxSpinDuration}
						</div>
					</SettingWrapper>
					<RangeSlider
						--slider-width="100%"
						isDoubleInput={true}
						min={1}
						max={300}
						step={1}
						bind:from={$minSpinDuration}
						bind:to={$maxSpinDuration}
					/>
				</Snackbar>
			</div>
			<div class="settings-column" />
		</div>
	</TitledSection>
	<TitledSection title="Фон">
		<div class="settings-row">
			<Snackbar>
				<SettingWrapper
					title="Ссылка"
					description="Динамический фон можно найти по этой ссылке: https://backgrounds.gallery/animated"
					isVertical={true}
				>
					{#if errorText}
						<span style="color: var(--error);">{errorText}</span>
					{/if}
					<Input
						--input-w="100%"
						--input-w-w="100%"
						id="video-url"
						type="text"
						placeholder="Ссылка на файл"
						bind:value={bgUrl}
					/>
				</SettingWrapper>
				<div style="display: flex; gap: 10px;">
					<TextButton
						--text-b-fs="14px"
						text="Установить"
						isDisabled={!bgUrl}
						on:click={setBackgroundImageOrVideo}
					/>
					<TextButton
						--text-b-fs="14px"
						text="Удалить"
						isDisabled={!$background.url}
						on:click={() => {
							errorText = '';
							settings.resetBackground();
						}}
					/>
				</div>
			</Snackbar>
			<Snackbar>
				<SettingWrapper title="Прозрачность интерфейса">
					<div>{Math.floor($backgroundTransparency * 100)}%</div>
				</SettingWrapper>
				<RangeSlider
					--slider-width="100%"
					min={0}
					max={1}
					step={0.01}
					bind:to={$backgroundTransparency}
				/>
			</Snackbar>
		</div>
	</TitledSection>
</div>

<style lang="scss">
	.settings-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20px;
		padding-bottom: 20px;
		overflow: hidden auto;
	}
	.settings-column {
		display: flex;
		gap: 10px;
		flex: 1;
		flex-direction: column;
	}
	.settings-row {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		flex-direction: row;
	}
</style>
