<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import SettingCard from './SettingCard.svelte';
	import SettingSection from './SettingSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';

	const app = getAppManagerContext();
</script>

<SettingSection isExtended>
	{#snippet header()}
		Таймер
	{/snippet}
	{#snippet content()}
		<SettingCard isExtended={app.settings.isAutoAddTimeEnabled}>
			{#snippet header()}
				<SettingWrapper title="Автодобавление времени" isHeader>
					<Switch bind:checked={app.settings.isAutoAddTimeEnabled} />
				</SettingWrapper>
			{/snippet}
			{#snippet content()}
				<SettingWrapper title="Новый лот">
					<Input
						id="new-lot-time"
						type="number"
						suffix="сек."
						placeholder="Значение"
						bind:value={app.settings.newLotBonusSec}
					/>
				</SettingWrapper>
				<SettingWrapper title="Новый лидер">
					<Input
						id="leader-time"
						type="number"
						suffix="сек."
						placeholder="Значение"
						bind:value={app.settings.newLeaderBonusSec}
					/>
				</SettingWrapper>
				<SettingWrapper title="Новый донат">
					<Input
						id="donation-time"
						type="number"
						suffix="сек."
						placeholder="Значение"
						bind:value={app.settings.newDonationBonusSec}
					/>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
	{/snippet}
</SettingSection>
