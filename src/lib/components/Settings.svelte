<script lang="ts">
	import timer from '$lib/stores/timer';
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
	import Auth from '$lib/components/Auth.svelte';
	import centrifugo from '$lib/stores/centrifugo';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import { SOCKET_STATE } from '$lib/constants';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ButtonSelect from './ButtonSelect.svelte';

	let isAuthorizedToDonationAlerts = $page.data.isAuthorizedToDonationAlerts;
	let isCentrigugoToggleDisabled = false;
	let errorText = '';
	let bgUrl: string;

	$: minSpinDuration = settings.minSpinDuration;
	$: maxSpinDuration = settings.maxSpinDuration;
	$: timerBaseTime = settings.timerBaseTime;
	$: timerKeyConfig = settings.timerKeyConfig;
	$: itemAddedAction = settings.itemAddedAction;
	$: leaderChangedAction = settings.leaderChangedAction;
	$: timerState = timer.state;
	$: background = settings.background;
	$: backgroundTransparency = settings.transparency;

	$: addByIdAction = settings.addByIdAction;
	$: centrifugoState = centrifugo.state;
	$: continueSpinAction = settings.extendSpinAction;
	$: stopSpinAction = settings.stopSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;
	$: intensity = settings.intensity;
	$: wheelWinnerDelay = settings.wheelWinnerDelay;
	$: autoScroll = settings.autoScroll;
	$: {
		if ($centrifugoState !== SOCKET_STATE.OPEN) {
			isCentrigugoToggleDisabled = false;
		}
	}

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
		<!-- <Auth
			icon={donatePayIcon}
			title="DonatePay"
			isLoggedIn={isAuthorizedToDonatePay}
			onLogIn={() => {
				isPopupOpen = true;
				guidePart = 0;
			}}
			onLogout={() => {
				fetch('/api/donatepay/logout');
				isAuthorizedToDonatePay = false;
			}}
		/> -->
		<!-- <Popup bind:isOpened={isPopupOpen}>
			{#if guidePart === 0}
				<div style="display: flex; flex-direction: column; gap: 10px;">
					<h2 style="margin: 0; text-align: center; text-wrap: pretty; color: var(--error);">
						Не показывайте последующие действия третьим лицам!
					</h2>
					<TextButton text="Продолжить" on:click={() => (guidePart = 1)} />
				</div>
			{:else}
				<div style="display: flex; flex-direction: column; gap: 10px;">
					<p style="margin: 0;">
						Перейдите на страницу <a href="https://donatepay.ru/page/api" target="_blank"
							>https://donatepay.ru/page/api</a
						>, затем скопируйте значение поля "Ваш API ключ" и вставьте его в поле ниже.
					</p>
					<Input
						--input-w="500px"
						--input-w-w="500px"
						id="donatepay-api-key"
						type="text"
						placeholder="API Key"
						isFilled={true}
						maxlength={60}
						onInput={() => (authError = '')}
						bind:value={donatepayApiKey}
					/>
					{#if authError}
						<p>{authError}</p>
					{/if}
					<TextButton
						text="Подключить"
						isDisabled={isLoadingDonatePayUser || donatepayApiKey.length !== 60 || authError !== ''}
						on:click={async () => {
							isLoadingDonatePayUser = true;

							const user = await donatePayApi.getUser(donatepayApiKey);

							if (user) {
								await donatePayApi.auth(donatepayApiKey);
								isAuthorizedToDonatePay = true;
								isPopupOpen = false;
							} else {
								authError = 'Неверный API ключ';
							}

							isLoadingDonatePayUser = false;
						}}
					/>
					{#if isLoadingDonatePayUser}
						<div>Загрузка...</div>
					{/if}
				</div>
			{/if}
		</Popup> -->
		<Auth
			icon={daIcon}
			title="DonationAlerts"
			isLoggedIn={isAuthorizedToDonationAlerts}
			onLogIn={() => goto('/api/donationalerts/auth')}
			onLogout={() => {
				fetch('/api/donationalerts/logout');
				isAuthorizedToDonationAlerts = false;
			}}
		/>
		{#if isAuthorizedToDonationAlerts}
			<div class="settings-row">
				<div class="settings-column">
					<Snackbar>
						<SettingWrapper
							title="Донаты"
							description="Отслеживать донаты пользователя и отображать их в очереди"
						>
							<Switch
								on={() => {
									isCentrigugoToggleDisabled = true;
									centrifugo.connect();
								}}
								off={() => centrifugo.disconnect()}
								isToggled={$centrifugoState === SOCKET_STATE.OPEN}
								isDisabled={$centrifugoState === SOCKET_STATE.CONNECTING ||
									isCentrigugoToggleDisabled}
								isManualToggle={true}
							/>
						</SettingWrapper>
					</Snackbar>
					<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
						<SettingWrapper
							title="Автодобавление по #ID"
							description="Если в сообщении доната присутствует #ID, автоматически прибавляет сумму доната к варианту с этим ID"
						>
							<Switch bind:isToggled={$addByIdAction} />
						</SettingWrapper>
					</Snackbar>

					<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
						<SettingWrapper
							title="Задержка"
							description="Определение победителя будет отложено на указанное значение, в течении которого можно активировать функцию 'Вклин'"
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
					<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
						<SettingWrapper
							title="Жаришка нереальная"
							description="С каждым донатом, сумма которого равна или выше заданного значения, увеличивается огонь на заднем фоне, который постепенно уменьшается"
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
				</div>
				<div class="settings-column">
					<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
						<SettingWrapper
							title="Вклин"
							description="Если сумма доната равна или превышает итоговое значение, продлевает кручение колеса и добавляет вариант из доната"
						>
							<Switch bind:isToggled={$continueSpinAction.isEnabled} />
						</SettingWrapper>
						<SettingWrapper title="Стартовая стоимость" isDisabled={!$continueSpinAction.isEnabled}>
							<NumberInput
								id="wheel-3"
								suffix="руб"
								onInput={() => currentExtendSpinPrice.set($continueSpinAction.price)}
								bind:value={$continueSpinAction.price}
							/>
						</SettingWrapper>

						<SettingWrapper title="Доп. время" isDisabled={!$continueSpinAction.isEnabled}>
							<NumberInput id="wheel-5" suffix="сек" bind:value={$continueSpinAction.seconds} />
						</SettingWrapper>
						<SettingWrapper
							title="Тип прироста стоимости"
							description={`Увеличение стоимости ${
								$continueSpinAction.stepType === 'fixed'
									? 'на заданное значение'
									: 'до суммы самого большого доната за время кручения колеса'
							}`}
							isDisabled={!$continueSpinAction.isEnabled}
							isAdditional={true}
							isVertical={true}
						>
							<ButtonSelect
								options={[
									{ title: 'Фиксированный', value: 'fixed' },
									{ title: 'От суммы доната', value: 'biggestDonation' }
								]}
								bind:currentOption={$continueSpinAction.stepType}
							/>
						</SettingWrapper>
						<SettingWrapper
							title="Прирост стоимости"
							isDisabled={!$continueSpinAction.isEnabled ||
								$continueSpinAction.stepType !== 'fixed'}
						>
							<NumberInput id="wheel-4" suffix="руб" bind:value={$continueSpinAction.step} />
						</SettingWrapper>
					</Snackbar>
					<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
						<SettingWrapper
							title="Стоп колесо"
							description="Останавливает колесо, если сумма доната равна заданному значению"
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
				</div>
			</div>
		{/if}
	</TitledSection>
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
					<SettingWrapper
						title="Горячие клавиши"
						description="[ ↑ ] - прибавить, [ ↓ ] - убавить, [←] - вернуть на исходную, [→] - запустить / приостановить"
					>
						<Switch bind:isToggled={$timerKeyConfig.isEnabled} />
					</SettingWrapper>
				</Snackbar>
			</div>
			<div class="settings-column">
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
						color="red"
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
					<div style="line-height: 24px;">{Math.floor($backgroundTransparency * 100)}%</div>
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
	<TitledSection title="Остальное">
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
			<div class="settings-column">
				<Snackbar>
					<SettingWrapper
						title="Автоскролинг списка"
						description="Списки на указанных страницах будут автоматически прокручиваться"
					/>

					<SettingWrapper title="На лотах">
						<Switch bind:isToggled={$autoScroll.isAuctionListEnabled} />
					</SettingWrapper>
					<SettingWrapper title="На колесе">
						<Switch bind:isToggled={$autoScroll.isWheelListEnabled} />
					</SettingWrapper>
					<SettingWrapper title="Скорость">
						<div>x{$autoScroll.speed}</div>
					</SettingWrapper>
					<RangeSlider
						--slider-width="100%"
						min={0}
						max={2}
						step={0.5}
						bind:to={$autoScroll.speed}
					/>
				</Snackbar>
			</div>
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
