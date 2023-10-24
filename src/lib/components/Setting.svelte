<script lang="ts">
	import NumberInput from './NumberInput.svelte';
	import Switch from './Switch.svelte';

	export let id: number | string;
	export let description: string;
	export let value: number | undefined = undefined;
	export let attribute: string | null = null;
	export let isToggled: boolean | null = null;
	export let isDisabled = false;
	export let callback: (() => void) | null = null;
</script>

<div class="setting">
	<p>{description}</p>
	<div class="setting-inputs">
		{#if value !== undefined}
			<NumberInput
				--input-w="100px"
				--input-text-al="center"
				{id}
				{attribute}
				placeholder="Значение"
				isDisabled={isToggled !== null ? !isToggled : false}
				bind:value
				on:input={callback}
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
			gap: 10px;
		}
		& p {
			flex: 1 1 0;
			margin: 0;
			max-width: 650px;
			line-height: 1;
			font-size: 18px;
			font-weight: 500;
		}
	}
</style>
