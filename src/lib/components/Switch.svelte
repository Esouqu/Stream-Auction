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
	type="button"
	class="switch"
	class:enabled={isToggled}
	disabled={isDisabled}
	on:click={onToggle}
/>

<style lang="scss">
	.switch {
		position: relative;
		width: 48px;
		height: 25px;
		padding: 0;
		border: 0;
		border-radius: 30px;
		background-color: var(--neutral);
		opacity: 1;
		transition: 0.2s;
		cursor: pointer;

		&:disabled {
			opacity: 0.5;
			cursor: default;
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
		&.enabled {
			background-color: var(--primary-50);

			&::after {
				left: 60%;
			}
		}
	}
</style>
