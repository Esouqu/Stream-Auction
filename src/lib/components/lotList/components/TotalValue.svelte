<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import { getAppManagerContext } from '$lib/context/appManagerContext';
	import { formatNumberWithSuffix } from '$lib/utils';

	const { lots } = getAppManagerContext();
</script>
