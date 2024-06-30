<script lang="ts">
	import { page } from '$app/stores';

	const pathName = $page.url.pathname;

	export let id: number | string;
	export let value: string = '';
	export let type: 'text' | 'number';
	export let placeholder: string = '';
	export let suffix: string = '';
	export let maxlength = 524288;
	export let isFilled = false;
	export let isDisabled = false;
	export let isPreventInput = false;
	export let isBorderless = false;
	export let element: HTMLInputElement | null = null;
	export let onEnter: (() => void) | null = null;
	export let onInput: (() => void) | null = null;
	export let onBlur: (() => void) | null = null;

	function handleInput(e: Event) {
		if (isPreventInput) return;

		const target = e.target as HTMLInputElement;

		if (type === 'number') {
			parseInput(target.value);
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
			parseInput(target.value);
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
			parseInput(target.value);
		} else {
			value = target.value;
		}

		onBlur();
	}

	function parseInput(inputValue: string) {
		value = inputValue;
		const parsedValue = value.match(/\d+/g)?.join('');
		value = parsedValue ?? '';
	}
</script>

<div
	class="input-wrapper"
	class:disabled={isDisabled}
	class:filled={isFilled}
	class:borderless={isBorderless}
	data-suffix={suffix}
>
	<input
		type="text"
		id="input-{id}-{pathName}"
		class="input"
		{value}
		{placeholder}
		{maxlength}
		spellcheck="false"
		disabled={isDisabled}
		on:keydown|stopPropagation={handleKeyDown}
		on:input|preventDefault={handleInput}
		on:blur|preventDefault={handleBlur}
		on:focus
		bind:this={element}
	/>
</div>

<style lang="scss">
	.input {
		position: relative;
		padding: var(--input-p, 10.5px);
		// border: 1px solid var(--outline);
		border: 0;
		border-radius: 5px;
		outline: 1px solid var(--outline);
		width: var(--input-w, 100%);
		line-height: 1;
		font-size: var(--input-font-size, 16px);
		font-weight: var(--input-font-weight, 400);
		text-align: var(--input-text-al, start);
		text-decoration: none;
		text-overflow: ellipsis;
		letter-spacing: 0.25px;
		color: var(--on-surface);
		box-shadow: inset 0 0 0 0 var(--primary-70);
		background-color: transparent;
		transition: outline-color 0.3s;
		overflow: hidden;

		&-wrapper {
			position: relative;
			display: flex;
			gap: 10px;
			width: var(--input-w-w, auto);

			&.disabled {
				opacity: 0.5;
			}

			&.filled {
				& .input {
					background-color: var(--surface-container-highest);

					&:focus {
						border-color: var(--primary);
					}

					&:hover:not(:focus):not(:disabled) {
						border-color: white;
					}
				}
			}

			&.borderless {
				& .input {
					border: 0;
					border-radius: 0;
					outline: 0;
					transition: 0.3s;

					&:focus {
						z-index: 999;
						outline: none;
						border-color: transparent;
						box-shadow: inset 0 -3px 0px 0 var(--primary-70);
					}

					&:hover:not(:focus):not(:disabled) {
						background-color: var(--hover-white);
						cursor: default;
					}
				}
			}

			&::after {
				content: attr(data-suffix);
				position: absolute;
				top: 52%;
				right: 10px;
				z-index: 999;
				translate: 0 -50%;
				font-size: 14px;
				text-transform: capitalize;
				opacity: 0.7;
			}
		}

		&:focus {
			z-index: 999;
			outline: 3px solid var(--primary);
			border-color: transparent;
		}

		&:hover:not(:focus):not(:disabled) {
			outline-color: white;
		}

		&::selection {
			background-color: var(--primary-60);
		}

		&::-webkit-inner-spin-button {
			display: none;
		}
	}
</style>
