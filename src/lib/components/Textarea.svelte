<script lang="ts">
	export let id: string;
	export let value: string;
	export let placeholder: string = '';
	export let isEditable = false;
	export let shouldFocus = false;

	let element: HTMLTextAreaElement;

	$: {
		if (shouldFocus) {
			element.focus();
		}
	}
</script>

<div class="textarea-wrapper">
	<textarea
		{id}
		{placeholder}
		class="textarea"
		spellcheck="false"
		readonly={!isEditable}
		bind:this={element}
		bind:value
		on:blur={() => (isEditable = false)}
		on:click={() => (isEditable = true)}
	/>
</div>

<style lang="scss">
	.textarea {
		position: relative;
		box-sizing: border-box;
		width: 100%;
		height: auto;
		padding: 10px;
		border-radius: 5px;
		border: 1px solid var(--outline);
		outline: 0px solid transparent;
		font-size: 20px;
		font-weight: 600;
		line-height: 26px;
		letter-spacing: 0.2px;
		text-overflow: ellipsis;
		text-decoration: none;
		white-space: break-spaces;
		color: var(--on-surface);
		background-color: transparent;
		transition: 0.2s;
		resize: none;
		cursor: default;

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
				background-color: var(--primary-container);
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
