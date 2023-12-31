<script lang="ts">
	import { page } from '$app/stores';

	export let id: number | string;
	export let value: string = '';
	export let valueKey: string | null = null;
	export let type: 'text' | 'number';
	export let placeholder: string;
	export let isDisabled = false;
	export let isPreventInput = false;
	export let colorStyle: 'white' | 'default' = 'default';
	export let onEnter: (() => void) | null = null;
	export let onInput: (() => void) | null = null;
	export let onBlur: (() => void) | null = null;

	const pathName = $page.url.pathname;

	function handleInput(e: Event) {
		if (isPreventInput) return;

		const target = e.target as HTMLInputElement;

		if (type === 'number') {
			parseInput(target);
		} else {
			value = target.value;
		}

		if (onInput) onInput();
	}

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;
		const isConfirmKey = e.code === 'Enter';

		if (!onEnter || !isConfirmKey) return;

		if (type === 'number') {
			parseInput(target);
		} else {
			value = target.value;
		}

		onEnter();
		target.blur();
	}

	function handleBlur(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!onBlur) return;

		if (type === 'number') {
			parseInput(target);
		} else {
			value = target.value;
		}

		onBlur();
	}

	function parseInput(target: HTMLInputElement) {
		value = target.value;
		const parsedValue = value.match(/\d+/g)?.join('');
		value = parsedValue ?? '';
	}
</script>

<div class="input-wrapper" style="--input-p-l: {type === 'text' ? 5 : 0}px;">
	<input
		type="text"
		id="input-{id}-{pathName}"
		class="input"
		class:input_white={colorStyle === 'white'}
		{placeholder}
		{value}
		spellcheck="false"
		on:keydown={(e) => handleKeyDown(e)}
		on:input|preventDefault={(e) => handleInput(e)}
		on:blur|preventDefault={(e) => handleBlur(e)}
		disabled={isDisabled}
	/>
	{#if valueKey}
		<span>{valueKey}</span>
	{/if}
</div>

<style lang="scss">
	.input {
		width: var(--input-w, 100%);
		padding: 5px 2px;
		padding-left: var(--input-p-l, 0);
		padding-right: var(--input-p-r, 0);
		border: none;
		border-bottom: 2px solid rgba(255, 255, 255, 0.3);
		outline: 0;
		line-height: 1;
		font-weight: var(--input-fw);
		text-overflow: ellipsis;
		text-align: var(--input-text-al, start);
		text-decoration: none;
		background-color: transparent;
		color: white;
		transition: 0.2s;
		overflow: hidden;

		&-wrapper {
			position: relative;
			display: flex;
			gap: 10px;
			width: var(--input-w-w, auto);

			& span {
				display: flex;
				justify-content: start;
				align-items: center;
				font-size: 14px;
				text-transform: uppercase;
			}
		}

		&_white {
			border-bottom: 2px solid rgba(0, 0, 0, 0.3);
			color: black;
			background-color: buttonface;

			&:focus {
				border-bottom: 2px solid var(--color-purple);
			}

			&:hover:not(:focus):not(:disabled) {
				border-bottom: 2px solid rgb(0, 0, 0);
			}
		}

		&:focus {
			border-bottom: 2px solid var(--color-purple);
		}

		&:hover:not(:focus):not(:disabled) {
			border-bottom: 2px solid white;
		}

		&:disabled {
			opacity: 0.5;
		}

		&::selection {
			background-color: #663399a8;
		}

		&::-webkit-inner-spin-button {
			display: none;
		}
	}
</style>
