<script lang="ts">
	import '../app.css';

	import { TooltipProvider } from '$lib/components/ui/tooltip';
	import { onMount } from 'svelte';
	import { updateLocalStorageVersion } from '$lib/utils';
	import Timer from '$lib/components/Timer.svelte';
	import appManager from '$lib/stores/AppManager.svelte';
	import { setAppManagerContext } from '$lib/context/appManagerContext';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Background from '$lib/components/Background.svelte';
	import SocketSelector from '$lib/components/SocketSelector.svelte';
	import UpdateDialog from '$lib/components/UpdateDialog.svelte';
	import DonationAlertsSocket from '$lib/stores/DonationAlertsSocket.svelte';
	import DonatePayCentrifuge from '$lib/stores/DonatePayCentrifuge.svelte';
	import donatePayApi from '$lib/api/donatePayApi.svelte';
	import DonationQueue from '$lib/components/donationQueue/DonationQueue.svelte';
	import donationAlertsApi from '$lib/api/donationalertsApi.svelte';
	import Sonner from '$lib/components/ui/sonner/sonner.svelte';
	import LotList from '$lib/components/lotList/LotList.svelte';
	import SpinExtendInfo from '$lib/components/SpinExtendInfo.svelte';
	import { page } from '$app/state';
	import { MediaQuery } from 'svelte/reactivity';
	import DonateXSocket from '$lib/stores/DonateXSocket.svelte';
	import donatexApi from '$lib/api/donatexApi.svelte';

	const { children } = $props();

	const large = new MediaQuery('(min-width: 1536px)');
	const isWheelPage = $derived(page.route.id === '/wheel');

	setAppManagerContext(appManager);

	onMount(() => {
		updateLocalStorageVersion(1);
		addSockets();

		return () => {
			for (const socket of appManager.donationSockets) {
				socket.disconnect();
			}
		};
	});

	async function addSockets() {
		const user = await donationAlertsApi.getUser();

		if (user) {
			const donationAlertsSocket = new DonationAlertsSocket({
				roomId: user.id,
				socketToken: user.socket_connection_token
			});

			donationAlertsApi.setUser(user);
			appManager.addSocket(donationAlertsSocket);
		}

		if (donatePayApi.user?.id) {
			const donatePaySocket = new DonatePayCentrifuge({ roomId: donatePayApi.user.id });
			appManager.addSocket(donatePaySocket);
		}

		const donatexToken = await donatexApi.getToken();

		if (donatexToken) {
			const donateXSocket = new DonateXSocket();
			appManager.addSocket(donateXSocket);
		}
	}
</script>

<TooltipProvider disableHoverableContent ignoreNonKeyboardFocus delayDuration={100}>
	<UpdateDialog />
	<Sidebar />

	<main class="relative flex w-full overflow-hidden rounded-xl border p-4">
		<Sonner richColors position="bottom-center" />
		<Background />

		{@render children()}

		<div class="relative flex h-full w-[26rem] shrink-0 flex-col space-y-4">
			<Timer />
			<SpinExtendInfo />
			{#if isWheelPage && !large.current}
				<div class="h-full overflow-hidden">
					<LotList compact />
				</div>
			{/if}
			<div class="relative flex h-full flex-col overflow-hidden rounded-2xl bg-card/40">
				<DonationQueue />
				{#if appManager.donationSockets.length > 0}
					<SocketSelector />
				{/if}
			</div>
		</div>
	</main>
</TooltipProvider>
