<script lang="ts">
	type colorTypes = 'purple' | 'orange';

	export let color: colorTypes;
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
	class:switch_purple={color === 'purple'}
	class:switch_orange={color === 'orange'}
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

		&_purple.toggled {
			background-color: var(--color-purple);
		}
		&_orange.toggled {
			background-color: var(--color-orange);
		}
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
		&.toggled {
			&::after {
				left: 60%;
			}
		}
	}
</style>
