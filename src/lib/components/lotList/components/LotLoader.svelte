<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import UploadIcon from '@lucide/svelte/icons/upload';
	import DownloadIcon from '@lucide/svelte/icons/download';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { Input } from '$lib/components/ui/input';

	const { lots } = getAppManagerContext();
	const fileName = 'лоты.csv';

	let fileImportRef: HTMLInputElement | null = $state(null);

	function handleFileInput(event: Event) {
		const target = event.target as HTMLInputElement;
		if (!target.files?.length) return;

		const file = target.files[0];
		const reader = new FileReader();

		reader.onload = async (e) => {
			const fileContent = e.target?.result as string;
			const csvRows = fileContent.split('\n');
			const lotsToAdd = csvRows.map((row) => {
				const [title, value, donators] = row.split(';');
				return { title, value: Number(value), donators: donators.split(',') };
			});

			for (const lot of lotsToAdd) {
				lots.add(lot.title, lot.value, lot.donators);
			}
		};

		reader.readAsText(file);
	}

	function downloadLotsAsCSV() {
		if (!lots.items) return;

		const csvRows = lots.items.map(
			({ title, value, donators }) => `${title};${value};${donators.join(',')}`
		);
		const csvData = csvRows.join('\n');
		const blob = new Blob([csvData], { type: 'text/csv' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = fileName;
		a.click();
	}
</script>

<Input
	type="file"
	id="fileElem"
	accept=".csv"
	class="hidden"
	onchange={handleFileInput}
	bind:ref={fileImportRef}
/>

<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" onclick={() => fileImportRef?.click()}>
				<UploadIcon />
			</Button>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent>Загрузить</TooltipContent>
</Tooltip>
<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="ghost"
				size="icon"
				disabled={!lots.items?.length}
				onclick={downloadLotsAsCSV}
			>
				<DownloadIcon />
			</Button>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent>Сохранить</TooltipContent>
</Tooltip>
