<script lang="ts">
	import { goto } from '$app/navigation';
	import donationAlertsApi from '$lib/api/donationalertsApi.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import DonationAlertsIcon from './icons/DonationAlertsIcon.svelte';
	import Integration from './Integration.svelte';
	import Spinner from './Spinner.svelte';

	const app = getAppManagerContext();

	function onLogout() {
		donationAlertsApi.logout();

		if (app.donationAlertsSocket) {
			app.donationAlertsSocket.disconnect();
			app.removeSocket(app.donationAlertsSocket.id);
		}
	}

	function onAuth() {
		goto('/api/donationalerts/auth');
	}
</script>

{#snippet icon()}
	<DonationAlertsIcon color="#f57507" />
{/snippet}

{#await donationAlertsApi.user}
	<Spinner />
{:then user}
	<Integration title="DonationAlerts" username={user?.name} {icon} {onAuth} {onLogout} />
{/await}
