<script lang="ts">
	import Auth from '$lib/components/Auth.svelte';
	import NumberInput from '$lib/components/NumberInput.svelte';
	import SettingWrapper from '$lib/components/SettingWrapper.svelte';
	import Snackbar from '$lib/components/Snackbar.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import TitledSection from '$lib/components/TitledSection.svelte';
	import centrifugo from '$lib/stores/centrifugo';
	import settings from '$lib/stores/settings';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_White.svg';
	import { SOCKET_STATE } from '$lib/constants';
	import { page } from '$app/stores';

	let isAuthorizedToDonationAlerts = $page.data.isAuthorizedToDonationAlerts;
	let isCentrigugoToggleDisabled = false;

	$: addByIdAction = settings.addByIdAction;
	$: centrifugoState = centrifugo.state;
	$: addLotWhileSpinAction = settings.addLotWhileSpinAction;
	$: continueSpinAction = settings.extendSpinAction;
	$: stopSpinAction = settings.stopSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;
	$: intensity = settings.intensity;
	$: wheelWinnerDelay = settings.wheelWinnerDelay;
	$: {
		if ($centrifugoState !== SOCKET_STATE.OPEN) {
			isCentrigugoToggleDisabled = false;
		}
	}
</script>

<svelte:head>
	<title>Интеграции - Аукцион</title>
</svelte:head>

<section class="integrations-sections">
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
								description="Определение победителя будет отложено на указанное значение, в течении которого можно продлить кручение или добавить вариант"
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
					</div>
					<div class="settings-column">
						<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
							<SettingWrapper
								title="Вклин"
								description="Возможность добавлять вариант во время кручения колеса"
							>
								<Switch bind:isToggled={$addLotWhileSpinAction} />
							</SettingWrapper>
						</Snackbar>
						<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
							<SettingWrapper
								title="Стоп колесо"
								description="Если сумма доната равна заданному значению, добавляет вариант из доната и останавливает колесо"
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
						<Snackbar isDisabled={$centrifugoState !== SOCKET_STATE.OPEN}>
							<SettingWrapper
								title="Продлевать кручение"
								description="Если сумма доната равна или превышает заданное значение, продлевает кручение колеса"
							>
								<Switch bind:isToggled={$continueSpinAction.isEnabled} />
							</SettingWrapper>
							<SettingWrapper
								title="Стартовая стоимость"
								isDisabled={!$continueSpinAction.isEnabled}
							>
								<NumberInput
									id="wheel-3"
									suffix="руб"
									onInput={() => currentExtendSpinPrice.set($continueSpinAction.price)}
									bind:value={$continueSpinAction.price}
								/>
							</SettingWrapper>
							<SettingWrapper title="Прирост стоимости" isDisabled={!$continueSpinAction.isEnabled}>
								<NumberInput id="wheel-4" suffix="руб" bind:value={$continueSpinAction.step} />
							</SettingWrapper>
							<SettingWrapper title="Длительность" isDisabled={!$continueSpinAction.isEnabled}>
								<NumberInput id="wheel-5" suffix="сек" bind:value={$continueSpinAction.seconds} />
							</SettingWrapper>
						</Snackbar>
					</div>
				</div>
			{/if}
		</TitledSection>
	</div>
</section>

<style lang="scss">
	.integrations-sections {
		display: flex;
		flex: 1;
		flex-direction: column;
		margin-top: 20px;
		width: 100%;
		overflow: hidden;
	}
	.settings-wrapper {
		display: flex;
		flex: 1;
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
