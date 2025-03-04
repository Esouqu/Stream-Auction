<script lang="ts">
	import { Slider } from '$lib/components/ui/slider';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import SettingCard from './SettingCard.svelte';
	import SettingSection from './SettingSection.svelte';
	import SettingWrapper from './SettingWrapper.svelte';
	import { Button } from '$lib/components/ui/button';
	import CircleOffIcon from 'lucide-svelte/icons/circle-off';
	import { patterns } from '$lib/constants';

	const app = getAppManagerContext();
	const { wheel } = app;
</script>

<SettingSection isExtended>
	{#snippet header()}
		Колесо
	{/snippet}
	{#snippet content()}
		<SettingCard>
			{#snippet header()}
				<SettingWrapper title="Паттерн" isHeader>
					<div class="flex">
						{#each patterns as pattern, i}
							<Button
								onclick={() => (wheel.settings.patternId = i)}
								variant="ghost"
								class="h-20 w-20 p-1 hover:bg-primary/10 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
								data-selected={wheel.settings.patternId === i}
							>
								{#if pattern}
									<img
										src={pattern}
										alt="pattern"
										class="pointer-events-none rounded"
										draggable="false"
									/>
								{:else}
									<CircleOffIcon />
								{/if}
							</Button>
						{/each}
					</div>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
		<SettingCard>
			{#snippet header()}
				<SettingWrapper
					title="Диапазон случайного числа"
					description="Диапазон в котором генерируется случайное число по нажатию кнопки генерации"
					isHeader
				>
					<div class="flex w-full items-center gap-2">
						<span class="min-w-6 text-sm">{wheel.settings.durationRange[0]}</span>
						<Slider
							type="multiple"
							bind:value={wheel.settings.durationRange}
							min={1}
							max={250}
							step={1}
						/>
						<span class="min-w-6 text-sm">{wheel.settings.durationRange[1]}</span>
					</div>
				</SettingWrapper>
			{/snippet}
		</SettingCard>
	{/snippet}
</SettingSection>
