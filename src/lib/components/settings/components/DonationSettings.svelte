<script lang="ts">
	import SettingWrapper from './SettingWrapper.svelte';
	import SettingSection from './SettingSection.svelte';
	import SettingCard from './SettingCard.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import donationAlertsApi from '$lib/api/donationalertsApi.svelte';
	import DonationAlertsIcon from '$lib/components/icons/DonationAlertsIcon.svelte';
	import DonateXIcon from '$lib/components/icons/DonateXIcon.svelte';
	import DonatePayIcon from '$lib/components/icons/DonatePayIcon.svelte';
	import donatexApi from '$lib/api/donatexApi.svelte';
	import donatePayApi from '$lib/api/donatePayApi.svelte';
	import Integration from '$lib/components/Integration.svelte';
	import DonatePayApiDialog from '$lib/components/DonatePayApiDialog.svelte';

	const app = getAppManagerContext();

	let isDialogOpen = $state(false);

	const integrations = $derived([
		{
			title: 'DonationAlerts',
			Icon: DonationAlertsIcon,
			isLoggedIn: !!donationAlertsApi.user,
			socket: app.donationAlertsSocket,
			onLogout: () => {
				donationAlertsApi.logout();

				if (app.donationAlertsSocket) {
					app.removeSocket(app.donationAlertsSocket.id);
				}
			},
			onAuth: () => goto('/api/donationalerts/auth')
		},
		{
			title: 'DonateX',
			Icon: DonateXIcon,
			isLoggedIn: donatexApi.isLoggedIn,
			onLogout: () => {
				donatexApi.logout();

				if (app.donatexSocket) {
					app.removeSocket(app.donatexSocket.id);
				}
			},
			onAuth: () => goto('/api/donatex/auth')
		},
		{
			title: 'DonatePay',
			Icon: DonatePayIcon,
			isLoggedIn: !!donatePayApi.user,
			onLogout: () => {
				donatePayApi.logout();

				if (app.donatePaySocket) {
					app.removeSocket(app.donatePaySocket.id);
				}
			},
			onAuth: () => {
				isDialogOpen = true;
			}
		}
	]);
</script>

<DonatePayApiDialog isOpen={isDialogOpen} />

<SettingSection>
	<div class="grid grid-cols-3 gap-4">
		{#each integrations as integration (integration.title)}
			<Integration {...integration}>
				{#snippet icon()}
					<integration.Icon
						class="inline size-5"
						color={integration.title === 'DonatePay'
							? '#44AB4F'
							: integration.title === 'DonationAlerts'
								? '#f57507'
								: ''}
					/>
				{/snippet}
			</Integration>
		{/each}
	</div>
	<SettingCard isExtended={app.settings.isSpinExtendEnabled}>
		{#snippet header()}
			<SettingWrapper title="Вклин" description="Продлевает кручение колеса" isHeader>
				<Switch id="vklin-enable" bind:checked={app.settings.isSpinExtendEnabled} />
			</SettingWrapper>
		{/snippet}
		{#snippet content()}
			<SettingWrapper title="Начальная стоимость">
				<Input
					id="vklin-start-price"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={() => app.settings.spinExtendBasePrice, (value) => app.updateBasePrice(value)}
				/>
			</SettingWrapper>
			<SettingWrapper
				title="Прирост стоимости"
				description="Каждый вклин будет увеличивать начальную стоимость на это значение"
			>
				<Input
					id="vklin-price-gain"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.settings.spinExtendPriceGain}
				/>
			</SettingWrapper>
			<SettingWrapper title="Доп. время" description="Время на которое продлится кручение">
				<Input
					id="vklin-extend-time"
					type="number"
					suffix="сек."
					placeholder="Значение"
					bind:value={app.settings.spinExtendSec}
				/>
			</SettingWrapper>
			<SettingWrapper
				title="Задержка"
				description="Время на которое откладывается определение победителя"
			>
				<Input
					id="vklin-stop-delay"
					type="number"
					suffix="сек."
					placeholder="Значение"
					bind:value={app.settings.spinStopDelaySec}
				/>
			</SettingWrapper>

			<SettingWrapper
				title="Стоп колесо"
				description="В любой момент кручения, останавливает колесо на текущей позиции без дальнейшей задержки"
			>
				<Input
					id="vklin-stop-price"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.settings.spinStopPrice}
				/>
			</SettingWrapper>
		{/snippet}
	</SettingCard>

	<SettingCard isExtended={app.background.settings.isFlameEnabled}>
		{#snippet header()}
			<SettingWrapper title="Пламя" description="Разжигает пламя на заднем фоне" isHeader>
				<Switch id="fire" bind:checked={app.background.settings.isFlameEnabled} />
			</SettingWrapper>
		{/snippet}
		{#snippet content()}
			<SettingWrapper title="Уровень 1">
				<Input
					id="fire-price-1"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.background.settings.flameSize1Price}
				/>
			</SettingWrapper>
			<SettingWrapper title="Уровень 2">
				<Input
					id="fire-price-2"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.background.settings.flameSize2Price}
				/>
			</SettingWrapper>
			<SettingWrapper title="Уровень 3">
				<Input
					id="fire-price-3"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.background.settings.flameSize3Price}
				/>
			</SettingWrapper>
			<SettingWrapper title="Уровень 4">
				<Input
					id="fire-price-4"
					type="number"
					suffix="руб."
					placeholder="Значение"
					bind:value={app.background.settings.flameSize4Price}
				/>
			</SettingWrapper>
			<SettingWrapper title="Длительность" description="Секунд до снижения уровня пламени">
				<Input
					id="fire-duration"
					type="number"
					suffix="сек."
					placeholder="Значение"
					bind:value={app.background.settings.flameSizeTickSec}
				/>
			</SettingWrapper>
		{/snippet}
	</SettingCard>
</SettingSection>
