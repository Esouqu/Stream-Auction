<script lang="ts">
	import '../app.css';
	import {
		Tooltip,
		TooltipContent,
		TooltipProvider,
		TooltipTrigger
	} from '$lib/components/ui/tooltip';
	import { onMount } from 'svelte';
	import { updateLocalStorageVersion } from '$lib/utils';
	import Timer from '$lib/components/Timer.svelte';
	import appManager from '$lib/stores/AppManager.svelte';
	import { setAppManagerContext } from '$lib/context/appManagerContext';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Background from '$lib/components/Background.svelte';
	import SocketSelector from '$lib/components/SocketSelector.svelte';
	import { Button } from '$lib/components/ui/button';
	import TrashIcon from 'lucide-svelte/icons/trash-2';
	import UpdateDialog from '$lib/components/UpdateDialog.svelte';
	import DonationAlertsSocket from '$lib/stores/DonationAlertsSocket.svelte';
	import DonatePayCentrifuge from '$lib/stores/DonatePayCentrifuge.svelte';
	import donatePayApi from '$lib/api/donatePayApi.svelte';
	import DonationQueue from '$lib/components/donationQueue/DonationQueue.svelte';
	import donationAlertsApi from '$lib/api/donationalertsApi.svelte';

	const { children } = $props();

	setAppManagerContext(appManager);

	onMount(async () => {
		updateLocalStorageVersion(1);

		appManager.setTheme(appManager.settings.theme);

		addSockets();
	});

	async function addSockets() {
		const user = await donationAlertsApi.getUser();
		if (user) {
			const donationAlertsSocket = new DonationAlertsSocket({
				id: user.id,
				socketToken: user.socket_connection_token
			});
			donationAlertsApi.setUser(user);
			appManager.addSocket(donationAlertsSocket);
		}

		if (donatePayApi.user?.id) {
			const donatePaySocket = new DonatePayCentrifuge({
				id: donatePayApi.user.id
			});
			appManager.addSocket(donatePaySocket);
		}
	}
</script>

<TooltipProvider disableHoverableContent delayDuration={100}>
	<!-- <UpdateDialog /> -->
	<Background />
	<Sidebar />

	<main class="relative mx-auto flex w-full max-w-[1920px] p-4">
		{@render children()}
		<div
			class="relative m-auto flex h-full w-[29rem] min-w-[29rem] flex-col rounded-md border bg-card"
			style="--tw-bg-opacity: {appManager.background.floatDimness}; --tw-border-opacity: {appManager
				.background.floatDimness};"
		>
			<Timer />

			<DonationQueue />

			<div
				class="grid grid-cols-[1fr_auto] items-center gap-2 border-t bg-secondary px-4 py-2"
				style="--tw-bg-opacity: {appManager.background
					.floatDimness}; --tw-border-opacity: {appManager.background.floatDimness};"
			>
				<SocketSelector />
				<Tooltip>
					<TooltipTrigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="ghost"
								size="icon"
								class="hover:bg-destructive hover:text-destructive-foreground"
								disabled={appManager.donations.items.length === 0}
								onclick={() => appManager.donations.clear()}
							>
								<TrashIcon />
							</Button>
						{/snippet}
					</TooltipTrigger>
					<TooltipContent>Очистить</TooltipContent>
				</Tooltip>
			</div>
		</div>
	</main>
</TooltipProvider>
