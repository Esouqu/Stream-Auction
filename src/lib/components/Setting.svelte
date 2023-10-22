<script lang="ts">
	import Input from './Input.svelte';
	import Switch from './Switch.svelte';

	export let id: number;
	export let isToggled: boolean | null;
	export let description: string;
	export let value: string;
	export let valueKey: string;
	export let isDisabled = false;
	export let callback: (() => void) | null = null;
</script>

<div class="setting">
	<p>{description}</p>
	<div class="setting-inputs">
		{#if isToggled || isToggled === null}
			<Input
				--input-w="100px"
				--input-text-al="center"
				{id}
				placeholder="Значение"
				type="number"
				bind:value
				{callback}
				{valueKey}
			/>
		{/if}
		{#if isToggled !== null}
			<Switch
				color="orange"
				on={() => (isToggled = true)}
				off={() => (isToggled = false)}
				bind:isToggled
				bind:isDisabled
			/>
		{/if}
	</div>
</div>

<style lang="scss">
	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		min-height: 34px;

		&-inputs {
			display: flex;
			align-items: center;
		}
		& p {
			flex: 1 1 0;
			margin: 0;
			max-width: 650px;
			font-size: 20px;
			font-weight: 500;
		}
	}
</style>
