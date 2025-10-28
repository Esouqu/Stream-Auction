<script lang="ts">
	import TrashcanIcon from '@lucide/svelte/icons/trash-2';
	import {
		AlertDialog,
		AlertDialogAction,
		AlertDialogCancel,
		AlertDialogContent,
		AlertDialogDescription,
		AlertDialogFooter,
		AlertDialogHeader,
		AlertDialogTitle,
		AlertDialogTrigger
	} from '$lib/components/ui/alert-dialog';
	import { buttonVariants } from '../../ui/button';
	import { cn } from '$lib/utils';
	import { getAppManagerContext } from '$lib/context/appManagerContext';

	const titleText = 'Вы уверены?';
	const warningText = 'Нажимая "Удалить", вы навсегда удалите все лоты.';
	const { lots } = getAppManagerContext();

	let isAlertOpened = $state(false);

	function onAlertAction() {
		lots.clear();
		isAlertOpened = false;
	}
</script>

<AlertDialog bind:open={isAlertOpened}>
	<AlertDialogTrigger
		class={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'rounded-full')}
		disabled={lots.isEmpty}
	>
		<TrashcanIcon />
	</AlertDialogTrigger>

	<AlertDialogContent>
		<AlertDialogHeader>
			<AlertDialogTitle>{titleText}</AlertDialogTitle>
			<AlertDialogDescription class="whitespace-pre-line">{warningText}</AlertDialogDescription>
		</AlertDialogHeader>
		<AlertDialogFooter>
			<AlertDialogCancel>Отмена</AlertDialogCancel>
			<AlertDialogAction class={buttonVariants({ variant: 'destructive' })} onclick={onAlertAction}>
				Удалить
			</AlertDialogAction>
		</AlertDialogFooter>
	</AlertDialogContent>
</AlertDialog>
