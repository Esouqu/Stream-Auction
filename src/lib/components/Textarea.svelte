<script lang="ts">
	export let id: string;
	export let value: string;
	export let placeholder: string;
</script>

<div class="textarea-wrapper">
	<textarea class="textarea" {id} rows="10" bind:value spellcheck="false" {placeholder} />
</div>

<style lang="scss">
	.textarea {
		box-sizing: border-box;
		width: 100%;
		height: 200px;
		padding: 10px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		outline: 0;
		font-size: 24px;
		font-weight: bold;
		line-height: 1;
		text-overflow: ellipsis;
		text-decoration: none;
		white-space: break-spaces;
		color: white;
		background-color: transparent;
		transition: 0.2s;
		resize: none;

		&-wrapper {
			position: relative;
			display: flex;
			width: 100%;
		}

		&:focus {
			border: 2px solid var(--color-purple);
		}

		&:hover:not(:focus):not(:disabled) {
			border: 2px solid white;
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
