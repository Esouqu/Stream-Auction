<script lang="ts">
    import { goto } from '$app/navigation';
    import liveHubApi from '$lib/api/liveHubApi.svelte';
    import { getAppManagerContext } from '$lib/context/appManagerContext';
    import Integration from './Integration.svelte';
    import Spinner from './Spinner.svelte';
    import LiveHubIcon from "$lib/components/icons/LiveHubIcon.svelte";

    const app = getAppManagerContext();

    function onLogout() {
        liveHubApi.logout();

        // if (app.donationAlertsSocket) {
        //     app.donationAlertsSocket.disconnect();
        //     app.removeSocket(app.donationAlertsSocket.id);
        // }
    }

    function onAuth() {
        goto('/api/livehub/auth');
    }
</script>

{#snippet icon()}
    <LiveHubIcon />
{/snippet}

{#await liveHubApi.user}
    <Spinner />
{:then user}
    <Integration title="LiveHub" username={user?.display_name} {icon} {onAuth} {onLogout} />
{/await}
