<script lang="ts">
	export let id: number | string;
	export let value: string = '';
	export let valueKey: string | null = null;
	export let type: 'text' | 'number';
	export let placeholder: string;
	export let isDisabled = false;
	export let isDefault = true;
	export let colorStyle: 'white' | 'default' = 'default';
	export let callback: (() => void) | null = null;

	function handleInput(e: Event) {
		if (!isDefault) return;
		const target = e.target as HTMLInputElement;

		if (type === 'number') {
			value = target.value;

			const parsedValue = value.match(/\d+|[\+]|[\-]/g)?.join('');

			value = parsedValue ?? '';
		} else {
			value = target.value;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement;
		const isConfirmKey = e.code === 'Enter';

		if (!callback || !isConfirmKey) return;

		if (type === 'number') {
			value = target.value;
			parseCalculation();
		} else {
			value = target.value;
		}

		callback();
		target.blur();
	}

	function handleBlur(e: Event) {
		const target = e.target as HTMLInputElement;

		if (!callback) return;

		if (type === 'number') {
			value = target.value;
			parseCalculation();
		} else {
			value = target.value;
		}

		callback();
	}

	function parseCalculation() {
		const parsedValue = value.match(/\d+|[\+]|[\-]/g)?.join('');

		value = parsedValue ?? '';

		if (value.includes('+')) {
			const values = value.split('+');
			const sum = values.reduce((a, b) => Number(a) + Number(b), 0);

			value = String(sum);
		}
		if (value.includes('-')) {
			const values = value.split('-').map((v) => Number(v));
			const sum = values.reduce((a, b) => {
				const numValue = a - b;

				if (isNaN(numValue) || numValue < 0) {
					return 0;
				}

				return numValue;
			}, 0);

			value = String(sum);
		}
	}
</script>

<div class="input-wrapper" style="--input-p-l: {type === 'text' ? 5 : 0}px;">
	<input
		type="text"
		id="input-{id}"
		class="input"
		class:input_white={colorStyle === 'white'}
		name="input-{id}"
		{placeholder}
		{value}
		spellcheck="false"
		on:blur={(e) => handleBlur(e)}
		on:keydown={(e) => handleKeyDown(e)}
		on:input|preventDefault={(e) => handleInput(e)}
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
				width: 50px;
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
