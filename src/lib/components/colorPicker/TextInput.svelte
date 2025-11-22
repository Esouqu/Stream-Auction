<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import { Input } from '../ui/input';

	type Props = {
		hex: string;
		onInput: (color: { hex?: string }) => void;
	};

	let { hex = $bindable(), onInput }: Props = $props();

	const HEX_COLOR_REGEX = /^#?([A-F0-9]{6}|[A-F0-9]{8})$/i;

	function getHex() {
		return hex;
	}

	function updateHex(value: string) {
		if (value === 'transparent') {
			hex = '#ffffff';
			onInput({ hex: 'transparent' });
			return;
		}
		if (HEX_COLOR_REGEX.test(value)) {
			hex = value;
			onInput({ hex });
		}
	}
</script>

<div class="space-y-2">
	<Input
		id={crypto.randomUUID()}
		class="w-[230px] px-3 text-center"
		bind:value={getHex, updateHex}
	/>
	<Button class="w-full" onclick={() => updateHex('transparent')}>Сбросить</Button>
</div>
