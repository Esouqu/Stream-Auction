<script>
	import { Badge } from '$lib/components/ui/badge';
</script>

<div class="flex w-full justify-evenly gap-4 text-xs text-muted-foreground">
	<div class="flex items-center gap-1">
		<div>Отмена изменения</div>
		<Badge variant="outline" class="bg-muted text-muted-foreground">Ctrl + Z</Badge>
	</div>
	<div class="flex items-center gap-1">
		<div>Повтор изменения</div>
		<Badge variant="outline" class="bg-muted text-muted-foreground">Ctrl + Shift + Z</Badge>
	</div>
</div>
