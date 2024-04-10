<script lang="ts">
	import { page } from '$app/stores';

	export let id: number | string;
	export let value: number = 0;
	export let suffix: string | null = null;
	export let label: string | null = null;
	export let placeholder: string = '';
	export let element: HTMLInputElement | null = null;
	export let isDisabled = false;
	export let isFilled = false;
	export let isPreventInput = false;
	export let isBorderless = false;
	export let onEnter: (() => void) | null = null;
	export let onInput: (() => void) | null = null;
	export let onBlur: (() => void) | null = null;

	const pathName = $page.url.pathname;

	function handleInput(e: Event) {
		if (isPreventInput) return;

		const target = e.target as HTMLInputElement;

		value = Number(target.value);

		if (onInput) onInput();
	}

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;
		const isConfirmKey = e.code === 'Enter';

		if (!onEnter || !isConfirmKey) return;

		value = Number(target.value);

		onEnter();
		target.blur();
	}

	function handleBlur(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!onBlur) return;

		value = Number(target.value);

		onBlur();
	}
</script>

<div
	class="input-wrapper"
	class:disabled={isDisabled}
	class:filled={isFilled}
	class:labeled={label}
	class:borderless={isBorderless}
	data-suffix={suffix}
>
	{#if label}
		<fieldset class="input-fieldset">
			<legend class="input-legend">
				<span>{label}</span>
			</legend>
		</fieldset>
	{/if}
	<input
		type="number"
		id="input-number-{id}-{pathName}"
		class="input"
		disabled={isDisabled}
		{placeholder}
		{value}
		bind:this={element}
		on:keydown={handleKeyDown}
		on:input|preventDefault={handleInput}
		on:blur|preventDefault={handleBlur}
	/>
</div>

<style lang="scss">
	.input {
		position: relative;
		padding: 10.5px;
		// border: 1px solid var(--outline);
		border: 0;
		border-radius: 5px;
		outline: 1px solid var(--outline);
		width: var(--input-w, 90px);
		line-height: 1;
		text-align: var(--input-text-al, start);
		text-overflow: ellipsis;
		text-decoration: none;
		letter-spacing: 0.25px;
		box-shadow: 0 0px 0px 0 var(--primary-70);
		color: var(--on-surface);
		background-color: transparent;
		transition: box-shadow 0.3s, background-color 0.2s, outline-color 0.2s, border-color 0.2s;
		overflow: hidden;

		&-fieldset {
			position: absolute;
			inset: -5px 0px 0px;
			margin: 0px;
			padding: 0px 8px;
			border: 1px solid var(--outline);
			border-radius: 5px;
			outline: 0;
			min-width: 0%;
			text-align: left;
			transition: outline-color 0.2s, border-color 0.2s;
			overflow: hidden;
			user-select: none;
		}

		&-legend {
			display: block;
			float: unset;
			padding: 0 2px;
			width: auto;
			max-width: 100%;
			height: 11px;
			font-size: 0.75em;
			color: var(--on-surface-variant);
			transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
			white-space: nowrap;
			overflow: hidden;
		}

		&-wrapper {
			position: relative;
			display: flex;
			gap: 10px;
			width: var(--input-w-w, min-content);

			&.disabled {
				opacity: 0.5;
			}

			&.filled {
				&:not(.labeled) {
					background-color: var(--surface-container-highest);
				}
				& .input {
					&:focus {
						border-color: var(--primary);
					}

					&:hover:not(:focus):not(:disabled) {
						border-color: white;
					}
				}
			}

			&.labeled {
				& .input {
					border: 1px solid transparent;
					outline: 0;

					&:hover {
						border-color: transparent !important;
					}
					&:focus {
						border: 1px solid transparent;
					}
				}

				&:hover {
					& .input-fieldset {
						border-color: white;
					}
				}

				&:has(.input:focus) .input-fieldset {
					border: 3px solid var(--primary);
				}

				&.filled .input-fieldset {
					background-color: var(--surface-container-highest);
				}
			}

			&.borderless {
				& .input {
					border: 0;
					border-radius: 0;
					outline: 0;

					&:focus {
						z-index: 999;
						outline: none;
						border-color: transparent;
						box-shadow: 0 3px 0px 0 var(--primary-70);
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
				font-size: 16px;
				font-weight: 400;
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

		&::-webkit-inner-spin-button {
			display: none;
		}
	}
</style>
