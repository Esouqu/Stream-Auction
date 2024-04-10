<script lang="ts">
	import { afterUpdate } from 'svelte';

	export let id: string;
	export let value: string;
	export let placeholder: string = '';
	export let element: HTMLTextAreaElement | null = null;
	export let isResizable = false;
	export let isEditable = false;

	let textareaHeight = 'auto';

	afterUpdate(() => {
		if (isResizable) updateTextareaHeight();
	});

	function updateTextareaHeight() {
		if (!isResizable || !element) return;

		element.style.height = 'auto'; // Reset the height to get the true scroll height
		const height = element.scrollHeight + 'px';

		element.style.height = height;
		textareaHeight = height;
	}
</script>

<div class="textarea-wrapper">
	<textarea
		{id}
		{placeholder}
		rows="1"
		class="textarea medium-title"
		class:resizable={isResizable}
		style="--textarea-resize: {textareaHeight}"
		spellcheck="false"
		readonly={!isEditable}
		bind:this={element}
		bind:value
		on:input={() => updateTextareaHeight()}
		on:blur={() => (isEditable = false)}
		on:click={() => (isEditable = true)}
	/>
</div>

<style lang="scss">
	.textarea {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: var(--textarea-h, auto);
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--outline);
		outline: 0px solid transparent;
		font-size: var(--textarea-font-size, 20px);
		text-align: var(--textarea-align, start);
		text-overflow: ellipsis;
		text-decoration: none;
		white-space: break-spaces;
		color: var(--on-surface);
		background-color: transparent;
		transition: 0.2s;
		resize: none;
		cursor: default;

		&.resizable {
			height: var(--textarea-resize, auto);
			overflow: hidden;
		}

		&-wrapper {
			position: relative;
			display: flex;
			width: 100%;
			height: 100%;
		}

		&:read-only {
			border: 1px solid transparent;
		}

		&:focus:not(:disabled, :read-only) {
			z-index: 999;
			outline: 3px solid var(--primary);
			border-color: transparent;
		}

		&:hover {
			&:read-only {
				background-color: rgba(255, 255, 255, 0.1);
			}

			&:not(:disabled, :read-only) {
				cursor: text;
			}
		}

		&:disabled {
			opacity: 0.5;
		}

		&::selection {
			background-color: var(--primary-60);
		}

		/* &::-webkit-inner-spin-button {
			display: none;
		} */
	}
</style>
