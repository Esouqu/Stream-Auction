<script lang="ts">
	import { SOCKET_STATE } from '$lib/constants';
	import centrifugo from '$lib/stores/centrifugo';
	import settings from '$lib/stores/settings';
	import SettingWrapper from './SettingWrapper.svelte';
	import Snackbar from './Snackbar.svelte';
	import TitledSection from './TitledSection.svelte';
	import TransitionContainer from './TransitionContainer.svelte';

	$: centrifugoState = centrifugo.state;
	$: addLotWhileSpinAction = settings.addLotWhileSpinAction;
	$: stopSpinAction = settings.stopSpinAction;
	$: extendSpinAction = settings.extendSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;

	$: toggles = [$addLotWhileSpinAction, $stopSpinAction.isEnabled, $extendSpinAction.isEnabled];
	$: haveToggles = toggles.some((t) => t);
</script>

{#if haveToggles && $centrifugoState === SOCKET_STATE.OPEN}
	<TitledSection --titled-section-justify="center" title="Возможности зрителя">
		{#if $addLotWhileSpinAction}
			<Snackbar --snackbar-p="10px 20px">
				<SettingWrapper title="Добавить вариант во время кручения" />
			</Snackbar>
		{/if}
		{#if $stopSpinAction.isEnabled}
			<Snackbar --snackbar-p="10px 20px">
				<SettingWrapper title="Стоп колесо">
					<span class="default-title" style="min-width: max-content;">
						{$stopSpinAction.price} руб
					</span>
				</SettingWrapper>
			</Snackbar>
		{/if}
		{#if $extendSpinAction.isEnabled}
			<Snackbar --snackbar-p="10px 20px">
				<SettingWrapper title="Продлить кручение колеса">
					<TransitionContainer trigger={$currentExtendSpinPrice}>
						<span class="default-title" style="min-width: max-content;">
							от {$currentExtendSpinPrice} руб
						</span>
					</TransitionContainer>
				</SettingWrapper>
			</Snackbar>
		{/if}
	</TitledSection>
{/if}
