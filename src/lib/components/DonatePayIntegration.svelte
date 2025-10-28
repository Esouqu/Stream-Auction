<script lang="ts">
	import donatePayApi from '$lib/api/donatePayApi.svelte';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import DonatePayCentrifuge from '$lib/stores/DonatePayCentrifuge.svelte';
	import { cn } from '$lib/utils';
	import DonatePayIcon from './icons/DonatePayIcon.svelte';
	import Input from './Input.svelte';
	import Integration from './Integration.svelte';
	import { badgeVariants } from './ui/badge';
	import { Button } from './ui/button';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from './ui/dialog';

	const app = getAppManagerContext();

	let apiKey = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let open = $state(false);

	async function saveApiKey() {
		isLoading = true;

		const user = await donatePayApi.getUser(apiKey);

		if (user) {
			donatePayApi.setUser({
				id: user.data.id,
				username: user.data.name
			});
			donatePayApi.setApiKey(apiKey);

			const donatePaySocket = new DonatePayCentrifuge({ id: user.data.id });
			app.addSocket(donatePaySocket);
			open = false;
		} else {
			error = 'Неверный API ключ';
		}

		isLoading = false;
	}

	function onLogout() {
		donatePayApi.clearUser();
		donatePayApi.logout();

		if (app.donatePaySocket) {
			app.donatePaySocket.disconnect();
			app.removeSocket(app.donatePaySocket.id);
		}
	}

	function onAuth() {}
</script>

{#snippet icon()}
	<DonatePayIcon color="#44AB4F" />
{/snippet}

{#if !donatePayApi.user?.id}
	<Dialog bind:open>
		<DialogTrigger>
			{#snippet child({ props })}
				<div class="w-full">
					<Button {...props} variant="outline" size="lg" class="w-full">
						{@render icon()}
						Авторизоваться
					</Button>
				</div>
			{/snippet}
		</DialogTrigger>
		<DialogContent class="w-[512px] p-4">
			<DialogHeader class="p-0 text-start">
				<DialogTitle>DonatePay API ключ</DialogTitle>
				<DialogDescription>
					Перейдите на страницу <Button
						variant="link"
						class="h-auto p-0"
						href="https://donatepay.ru/page/api"
						target="_blank">https://donatepay.ru/page/api</Button
					>, затем скопируйте значение поля "Ваш API ключ" и вставьте его в поле ниже.
				</DialogDescription>
			</DialogHeader>
			<div class="space-y-4">
				<div class="space-y-2">
					<span class={cn(badgeVariants({ variant: 'destructive' }), 'text-sm')}>
						Никому не показывайте свой API ключ
					</span>
					<Input
						id="donatepay-api-key"
						type="password"
						placeholder="Введите API ключ"
						maxlength={60}
						oninput={() => (error = '')}
						bind:value={apiKey}
					/>
				</div>
				<div class="flex items-center gap-4 justify-self-end">
					{#if error}
						<p class="text-destructive">{error}</p>
					{/if}
					<Button disabled={isLoading || apiKey.length !== 60 || error !== ''} onclick={saveApiKey}>
						Сохранить
					</Button>
				</div>
			</div>
		</DialogContent>
	</Dialog>
{:else}
	<Integration title="DonatePay" username={donatePayApi.user.username} {icon} {onAuth} {onLogout} />
{/if}
