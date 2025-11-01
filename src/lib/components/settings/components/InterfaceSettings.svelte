<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Slider } from '$lib/components/ui/slider';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import SettingCard from './SettingCard.svelte';
	import SettingSection from './SettingSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';
	import TrashIcon from '@lucide/svelte/icons/trash-2';

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
	<SettingCard>
		{#snippet header()}
			<SettingWrapper
				title="Фон"
				description={`Убедитесь, что ссылка оканчивается на .jpg, .png, .mp4, .webm и тд.\nДинамический фон, к примеру, можно найти по этой ссылке: <a href="https://backgrounds.gallery/animated" target="_blank" class="font-medium text-primary underline underline-offset-2">https://backgrounds.gallery/animated</a>`}
				isHeader
			/>
		{/snippet}
		{#snippet content()}
			<div class="grid w-full grid-cols-[1fr_auto] gap-2">
				<Input
					id="bg"
					type="text"
					class="w-full"
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
			<SettingWrapper title="Затенение" isHeader>
				<div class="flex w-full gap-4">
					<Slider
						id="bg-dimness"
						type="single"
						min={0}
						max={100}
						bind:value={background.settings.dimness}
					/>
					<span class="min-w-10">{dimnessPercent}%</span>
				</div>
			</SettingWrapper>
			<SettingWrapper title="Размытие" isHeader>
				<div class="flex w-full gap-4">
					<Slider
						id="bg-blur"
						type="single"
						min={0}
						max={20}
						bind:value={background.settings.blur}
					/>
					<span class="min-w-10">{background.blur}</span>
				</div>
			</SettingWrapper>
		{/snippet}
	</SettingCard>
</SettingSection>
