<script lang="ts">
	import { page } from '$app/stores';

	export let id: number | string;
	export let value: number = 0;
	export let attribute: string | null = null;
	export let placeholder: string = 'Значение';
	export let isDisabled = false;
	export let colorStyle: 'white' | 'default' = 'default';

	const pathName = $page.url.pathname;
</script>

<div class="input-wrapper">
	<input
		type="number"
		id="number-input-{id}-{pathName}"
		class="input"
		class:input_white={colorStyle === 'white'}
		spellcheck="false"
		{placeholder}
		bind:value
		on:blur
		on:keydown
		on:input
		disabled={isDisabled}
	/>
	{#if attribute}
		<span>{attribute}</span>
	{/if}
</div>

<style lang="scss">
	.input {
		width: var(--input-w, 100%);
		padding: 7px 0;
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
