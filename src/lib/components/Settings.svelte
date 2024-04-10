<script lang="ts">
	import timer from '$lib/stores/timer';
	import RangeSlider from '$lib/components/RangeSlider.svelte';
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import settings from '$lib/stores/settings';
	import { SOCKET_STATE, TIMER_STATE } from '$lib/constants';
	import TitledSection from './TitledSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';
	import Snackbar from './Snackbar.svelte';
	import Switch from './Switch.svelte';
	import NumberInput from './NumberInput.svelte';
	import { isVideoOrImage } from '$lib/utils';
	import centrifugo from '$lib/stores/centrifugo';
	import { page } from '$app/stores';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import Auth from './Auth.svelte';

	let isAuthorizedToDonationAlerts = $page.data.isAuthorizedToDonationAlerts;
	let errorText: string = '';
	let bgUrl: string;

	$: centrifugoState = centrifugo.state;
	$: minSpinDuration = settings.minSpinDuration;
	$: maxSpinDuration = settings.maxSpinDuration;
	$: addLotWhileSpinAction = settings.addLotWhileSpinAction;
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
	<TitledSection>
		<Auth
			icon={daIcon}
			title="DonationAlerts"
			url="/api/donationalerts/auth"
			isLoggedIn={isAuthorizedToDonationAlerts}
			onLogout={() => {
				fetch('/api/donationalerts/logout');
				isAuthorizedToDonationAlerts = false;
			}}
		/>
		{#if isAuthorizedToDonationAlerts}
			<Snackbar>
				<SettingWrapper
					title="Донаты"
					description="Отслеживать донаты пользователя и отображать их в очереди"
				>
					<Switch
						on={() => centrifugo.connect()}
						off={() => centrifugo.disconnect()}
						isToggled={$centrifugoState === SOCKET_STATE.OPEN}
						isDisabled={$centrifugoState === SOCKET_STATE.CONNECTING}
					/>
				</SettingWrapper>
			</Snackbar>
			<Snackbar>
				<SettingWrapper
					title="Вклин"
					description="Возможность добавлять / обновлять лот во время кручения колеса"
				>
					<Switch bind:isToggled={$addLotWhileSpinAction} />
				</SettingWrapper>
			</Snackbar>
			<Snackbar>
				<SettingWrapper
					title="Продлевать кручение"
					description="Если сумма доната равна или превышает заданное значение, продлевает кручение колеса"
				>
					<Switch bind:isToggled={$continueSpinAction.isEnabled} />
				</SettingWrapper>
				<SettingWrapper title="Стоимость" isDisabled={!$continueSpinAction.isEnabled}>
					<NumberInput
						id="wheel-3"
						suffix="руб"
						onInput={() => currentExtendSpinPrice.set($continueSpinAction.price)}
						bind:value={$continueSpinAction.price}
					/>
				</SettingWrapper>
				<SettingWrapper title="Увеличение стоимости" isDisabled={!$continueSpinAction.isEnabled}>
					<NumberInput id="wheel-4" suffix="руб" bind:value={$continueSpinAction.step} />
				</SettingWrapper>
				<SettingWrapper title="Длительность" isDisabled={!$continueSpinAction.isEnabled}>
					<NumberInput id="wheel-5" suffix="сек" bind:value={$continueSpinAction.seconds} />
				</SettingWrapper>
			</Snackbar>
			<Snackbar>
				<SettingWrapper
					title="Останавливать кручение"
					description="Если сумма доната равна или превышает заданное значение, останавливает колесо на текущей позиции и обновляет вариант из доната, либо добавляет, если такого нет"
				>
					<Switch bind:isToggled={$stopSpinAction.isEnabled} />
				</SettingWrapper>
				<SettingWrapper title="Стоимость" isDisabled={!$stopSpinAction.isEnabled}>
					<NumberInput
						id="wheel-2"
						suffix="руб"
						placeholder="Значение"
						bind:value={$stopSpinAction.price}
					/>
				</SettingWrapper>
			</Snackbar>
			<Snackbar>
				<SettingWrapper
					title="Задержка"
					description="Определение победителя будет отложено на указанное значение, в течении которого возможно продлить кручение"
				>
					<Switch bind:isToggled={$wheelWinnerDelay.isEnabled} />
				</SettingWrapper>
				<SettingWrapper title="Длительность" isDisabled={!$wheelWinnerDelay.isEnabled}>
					<NumberInput
						id="wheel-1"
						suffix="сек"
						placeholder="Значение"
						bind:value={$wheelWinnerDelay.seconds}
					/>
				</SettingWrapper>
			</Snackbar>
			<Snackbar>
				<SettingWrapper
					title="Жаришка нереальная"
					description="С каждым донатом, который равен или выше заданного значения, увеличивается огонь на заднем фоне, который постепенно уменьшается"
				>
					<Switch bind:isToggled={$intensity.isEnabled} />
				</SettingWrapper>
				<SettingWrapper title="Стоимость" isDisabled={!$intensity.isEnabled}>
					<NumberInput
						--input-w="90px"
						id="flame"
						suffix="руб"
						placeholder="Значение"
						bind:value={$intensity.price}
					/>
				</SettingWrapper>
			</Snackbar>
		{/if}
	</TitledSection>

	<TitledSection title="Таймер">
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
			<SettingWrapper title="Добавлять время за новый лот">
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
	</TitledSection>
	<TitledSection title="Колесо">
		<Snackbar>
			<SettingWrapper
				title="Диапазон случайного числа"
				description="Диапазон в котором генерируется случайное число по нажатию кнопки генерации"
			/>
			<SettingWrapper title="Минимум">
				<NumberInput id="wheel-6" suffix="сек" bind:value={$minSpinDuration} />
			</SettingWrapper>
			<SettingWrapper title="Максимум">
				<NumberInput id="wheel-7" suffix="сек" bind:value={$maxSpinDuration} />
			</SettingWrapper>
		</Snackbar>
	</TitledSection>
	<TitledSection title="Фон">
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
			<SettingWrapper title="Прозрачность интерфейса ({$backgroundTransparency})" isVertical={true}>
				<RangeSlider
					--slider-width="100%"
					min={0}
					max={1}
					step={0.05}
					bind:value={$backgroundTransparency}
				/>
			</SettingWrapper>
		</Snackbar>
	</TitledSection>
</div>

<style lang="scss">
	.settings-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
</style>
