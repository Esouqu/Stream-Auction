<script lang="ts">
	import storable from '$lib/stores/LocalStore.svelte';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from './ui/dialog';
	import { formatDate } from '$lib/utils';

	const lastSeenUpdates = storable<number | null>(null, 'lastSeenUpdates');
	const lastUpdateDate = new Date('2025-03-04 11:00:00');

	let haveSeenUpdates = $derived(
		lastSeenUpdates.value ? new Date(lastSeenUpdates.value) > lastUpdateDate : false
	);

	function onOpenChange(isOpen: boolean) {
		if (!isOpen) {
			lastSeenUpdates.value = new Date().getTime();
		}
	}
</script>

<Dialog open={!haveSeenUpdates} {onOpenChange}>
	<DialogTrigger class="absolute" />
	<DialogContent>
		<DialogHeader>
			<DialogTitle>Обновление</DialogTitle>
			<DialogDescription>{formatDate(new Date(lastUpdateDate))}</DialogDescription>
		</DialogHeader>

		<ul class="list-disc pl-6 text-sm">
			<li>Обновленный дизайн</li>
			<li>Интеграция с DonatePay</li>
			<li>Редактор текста для правил</li>
			<li>Возможность устанавливать время по нажатию на таймер</li>
			<li>Автодобавление времени за новый донат</li>
			<li>Выбор паттерна для колеса</li>
			<li>Возможность выбрать основной цвет</li>
			<li>Возможность сохранять и загружать лоты</li>
			<li>Возможность изменять размер лотов</li>
			<li>Кнопка удаления очереди донатов</li>
		</ul>
	</DialogContent>
</Dialog>
