<script lang="ts">
	import Input from './Input.svelte';
	import Switch from './Switch.svelte';

	export let id: number;
	export let isToggled: boolean | null;
	export let description: string;
	export let value: string;
	export let valueKey: string;
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
			<Switch on={() => (isToggled = true)} off={() => (isToggled = false)} bind:isToggled />
		{/if}
	</div>
</div>

<style lang="scss">
	.setting {
		display: flex;
		align-items: center;
		gap: 20px;
		min-height: 34px;

		&-inputs {
			display: flex;
			align-items: center;
		}
		& p {
			flex: 1 1 0;
			margin: 0;
			font-size: 20px;
			font-weight: 600;
		}
	}
</style>
