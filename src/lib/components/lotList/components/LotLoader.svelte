<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import SaveIcon from '@lucide/svelte/icons/save';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Input } from '$lib/components/ui/input';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { cn } from '$lib/utils';

	const { lots } = getAppManagerContext();

	let fileImportRef: HTMLInputElement | null = $state(null);

	async function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		try {
			const text = await file.text();

			const lotsToAdd = text
				.split('\n')
				.filter((row) => row.trim())
				.map((row) => {
					const [title, value, donators] = row.split(';');
					return {
						title: title?.trim(),
						value: Number(value?.trim()) || 0,
						donators: donators?.split(',').map((d) => d.trim()) || []
					};
				});

			for (const lot of lotsToAdd) {
				lots.add(lot.title, lot.value, lot.donators);
			}
		} catch (err) {
			console.error('Error reading file:', err);
		} finally {
			target.value = '';
		}
	}

	function downloadLots() {
		if (!lots.items || lots.items.length === 0) return;

		const csvRows = lots.items.map(
			({ title, value, donators }) => `${title};${value};${donators.join(',')}`
		);

		const csvData = csvRows.join('\n');
		const blob = new Blob([csvData], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);

		const date = new Date().toISOString().split('T')[0];
		const a = document.createElement('a');
		a.href = url;
		a.download = `lots-${date}.csv`;
		a.click();

		setTimeout(() => URL.revokeObjectURL(url), 100);
	}
</script>

<Input
	type="file"
	id="fileElem"
	accept=".csv, .txt"
	class="hidden"
	onchange={handleFileInput}
	bind:ref={fileImportRef}
/>

<Dialog>
	<Tooltip>
		<DialogTrigger>
			{#snippet child({ props })}
				<TooltipTrigger {...props} class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<SaveIcon />
				</TooltipTrigger>
			{/snippet}
		</DialogTrigger>
		<TooltipContent>Сохранение/Загрузка</TooltipContent>
	</Tooltip>

	<DialogContent class="w-126">
		<DialogHeader class="pb-0 text-start">
			<DialogTitle>Сохранение/Загрузка</DialogTitle>
			<DialogDescription>
				Поддерживаемый формат файлов: <span class="text-foreground">.csv</span> и
				<span class="text-foreground">.txt</span>.
				<br />
				Одна строка - один лот, где каждое значение разделено точкой с запятой. (<span
					class="text-foreground">название</span
				>
				<b>;</b>
				<span class="text-foreground">сумма</span>
				<b>;</b>
				<span class="text-foreground">ник_1</span><b>,</b>
				<span class="text-foreground">ник_2</span>...)
			</DialogDescription>
		</DialogHeader>
		<div class="flex justify-end gap-4 p-6 pt-0">
			<Button class="w-full shrink" disabled={!lots.items?.length} onclick={downloadLots}>
				<DownloadIcon />
				Сохранить
			</Button>
			<Button
				class="w-full shrink"
				disabled={!lots.items?.length}
				onclick={() => fileImportRef?.click()}
			>
				<UploadIcon />
				Загрузить
			</Button>
		</div>
	</DialogContent>
</Dialog>
