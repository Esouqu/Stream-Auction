<script lang="ts">
	export let isToggled = false;
	export let isDisabled = false;
	export let on: (() => void) | null = null;
	export let off: (() => void) | null = null;

	function onToggle() {
		isToggled = !isToggled;

		if (on && isToggled) on();
		if (off && !isToggled) off();
	}
</script>

<button
	class="switch"
	class:toggled={isToggled}
	type="button"
	on:click={onToggle}
	disabled={isDisabled}
/>

<style lang="scss">
	.switch {
		position: relative;
		width: 48px;
		height: 25px;
		padding: 0;
		border: 0;
		border-radius: 30px;
		background-color: gray;
		opacity: 1;
		transition: 0.2s;
		cursor: pointer;

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		&::after {
			content: '';
			position: absolute;
			left: 15%;
			top: 50%;
			translate: 0 -50%;
			border-radius: 50%;
			width: 12px;
			height: 12px;
			box-shadow: 0 1px 2px black;
			background-color: white;
			transition: 0.2s;
		}
		&.toggled {
			background-color: var(--switch-color, var(--color-orange));

			&::after {
				left: 60%;
			}
		}
	}
</style>
