<script lang="ts">
	import Input from '$lib/components/Input.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Slider } from '$lib/components/ui/slider';
	import { themes } from '$lib/constants';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import SettingCard from './SettingCard.svelte';
	import SettingSection from './SettingSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';
	import TrashIcon from 'lucide-svelte/icons/trash-2';

	const app = getAppManagerContext();
	const { background } = app;
	const dimnessPercent = $derived(Math.round(background.dimness));

	function getBackground() {
		return background.url || '';
	}

	function setBackground(value: string) {
		const type = background.getType(value);

		if (!value || !type) {
			background.clearBackground();
			return;
		}

		background.setBackground(value);
	}
</script>

<SettingSection isExtended>
	{#snippet header()}
		Интерфейс
	{/snippet}
	{#snippet content()}
		<SettingCard>
			{#snippet header()}
				<SettingWrapper title="Основной цвет" isHeader>
					<div class="grid grid-cols-[repeat(8,_2.5rem)] gap-1">
						{#each themes as item}
							<Button
								size="icon"
								class="overflow-hidden rounded-full border-4 border-muted bg-transparent transition-colors hover:border-white hover:bg-transparent active:scale-90 data-[selected=true]:border-primary"
								data-selected={item.theme === app.settings.theme}
								onclick={() => app.setTheme(item.theme)}
							>
								<div
									class="h-3/4 w-3/4 rounded-full"
									style="background-color: {item.color.hex()};"
								></div>
							</Button>
						{/each}
					</div>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
		<SettingCard>
			{#snippet header()}
				<SettingWrapper
					title="Фон"
					description={`Убедитесь, что ссылка оканчивается на .jpg, .png, .mp4, .webm и тд.\nДинамический фон можно найти по этой ссылке: <a href="https://backgrounds.gallery/animated" target="_blank" class="font-medium text-primary underline underline-offset-2">https://backgrounds.gallery/animated</a>`}
					isHeader
				/>
			{/snippet}
			{#snippet content()}
				<SettingWrapper title="Ссылка" isHeader>
					<div class="grid w-full grid-cols-[1fr_auto] gap-2">
						<Input
							id="bg"
							type="text"
							placeholder=".jpg, .png, .mp4, .webm ..."
							bind:value={getBackground, setBackground}
						/>
						<Button
							variant="ghost"
							size="icon"
							class="hover:bg-destructive hover:text-destructive-foreground"
							disabled={!background.url}
							onclick={() => background.clearBackground()}
						>
							<TrashIcon />
						</Button>
					</div>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
		<SettingCard>
			{#snippet header()}
				<SettingWrapper title="Прозрачность" isHeader>
					<div class="flex w-full gap-4">
						<Slider
							id="bg-dimness"
							type="single"
							bind:value={background.settings.dimness}
							min={0}
							max={100}
						/>
						<span class="min-w-10 text-sm">{dimnessPercent}%</span>
					</div>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
	{/snippet}
</SettingSection>
