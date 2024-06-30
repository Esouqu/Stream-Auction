<script lang="ts">
	import { SOCKET_STATE } from '$lib/constants';
	import centrifugo from '$lib/stores/centrifugo';
	import settings from '$lib/stores/settings';
	import Snackbar from './Snackbar.svelte';

	$: centrifugoState = centrifugo.state;
	$: stopSpinAction = settings.stopSpinAction;
	$: extendSpinAction = settings.extendSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;

	$: toggles = [$extendSpinAction.isEnabled, $stopSpinAction.isEnabled];
	$: isAnyToggleEnabled = toggles.some((t) => t);
</script>

{#if isAnyToggleEnabled && $centrifugoState === SOCKET_STATE.OPEN}
	<div class="grid-container">
		{#if $extendSpinAction.isEnabled}
			<Snackbar --snackbar-p="8px 16px">
				<div class="text-wrapper">
					<span class="default-title"> Вклин </span>
					<span class="default-title"> от {$currentExtendSpinPrice} руб </span>
				</div>
			</Snackbar>
		{/if}
		{#if $stopSpinAction.isEnabled}
			<Snackbar --snackbar-p="8px 16px">
				<div class="text-wrapper">
					<span class="default-title"> Стоп колесо </span>
					<span class="default-title"> {$stopSpinAction.price} руб </span>
				</div>
			</Snackbar>
		{/if}
	</div>
{/if}

<style lang="scss">
	.grid-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;

		@media (max-width: 1366px) {
			grid-template-columns: 1fr;
		}
	}
	.text-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;

		& span {
			min-width: max-content;
		}

		@media (max-width: 1366px) {
			flex-direction: row;
			justify-content: space-between;
		}
	}
</style>
