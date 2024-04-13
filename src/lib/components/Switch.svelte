<script lang="ts">
	export let isToggled = false;
	export let isDisabled = false;
	export let isManualToggle = false;
	export let on: (() => void) | null = null;
	export let off: (() => void) | null = null;

	function onToggle() {
		if (on && !isToggled) on();
		if (off && isToggled) off();

		if (!isManualToggle) {
			isToggled = !isToggled;
		}
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
		min-width: 42px;
		height: 24px;
		padding: 0;
		border: 0;
		border-radius: 100px;
		outline: 2px solid #b4b4b4;
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
			left: 3px;
			top: 50%;
			translate: 0 -50%;
			border-radius: 50%;
			width: 18px;
			height: 18px;
			box-shadow: 0 0px 2px black;
			background-color: white;
			transition: 0.2s;
		}
		&.enabled {
			outline-color: var(--primary-70);
			background-color: var(--primary-50);

			&::after {
				translate: calc(100%) -50%;
			}
		}
	}
</style>
