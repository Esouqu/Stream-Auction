<script lang="ts">
	import { SOCKET_STATE } from '$lib/constants';
	import centrifugo from '$lib/stores/centrifugo';
	import settings from '$lib/stores/settings';
	import SettingWrapper from './SettingWrapper.svelte';
	import Snackbar from './Snackbar.svelte';
	import TitledSection from './TitledSection.svelte';

	$: centrifugoState = centrifugo.state;
	$: stopSpinAction = settings.stopSpinAction;
	$: extendSpinAction = settings.extendSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;

	$: toggles = [$extendSpinAction.isEnabled, $stopSpinAction.isEnabled];
	$: haveToggles = toggles.some((t) => t);
</script>

{#if haveToggles && $centrifugoState === SOCKET_STATE.OPEN}
	<TitledSection
		--titled-section-justify="center"
		--titled-section-p="0px"
		title="Возможности донатера"
	>
		<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
			{#if $extendSpinAction.isEnabled}
				<Snackbar --snackbar-p="12px 16px">
					<SettingWrapper title="Вклин">
						<span class="default-title" style="min-width: max-content;">
							от {$currentExtendSpinPrice} руб
						</span>
					</SettingWrapper>
				</Snackbar>
			{/if}
			{#if $stopSpinAction.isEnabled}
				<Snackbar --snackbar-p="12px 16px">
					<SettingWrapper title="Стоп колесо">
						<span class="default-title" style="min-width: max-content;">
							{$stopSpinAction.price} руб
						</span>
					</SettingWrapper>
				</Snackbar>
			{/if}
		</div>
	</TitledSection>
{/if}
