<script lang="ts">
	import { Toggle } from '$lib/components/ui/toggle';
	import { Tooltip, TooltipContent, TooltipTrigger } from '$lib/components/ui/tooltip';
	import RepeatIcon from '@lucide/svelte/icons/repeat-2';

	type Props = {
		isDonatorsShown?: boolean;
	};

	let { isDonatorsShown = $bindable(false) }: Props = $props();
</script>

<Tooltip>
	<TooltipTrigger>
		{#snippet child({ props })}
			<Toggle
				{...props}
				class="shrink-0 rounded-full"
				variant="ghost"
				size="icon"
				bind:pressed={isDonatorsShown}
			>
				<RepeatIcon />
			</Toggle>
		{/snippet}
	</TooltipTrigger>
	<TooltipContent>Ники вместо названия</TooltipContent>
</Tooltip>
