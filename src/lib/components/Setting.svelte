<script lang="ts">
	import Help from './Help.svelte';
	import NumberInput from './NumberInput.svelte';
	import Switch from './Switch.svelte';

	export let id: number | string;
	export let description: string;
	export let help = '';
	export let value = 0;
	export let suffix = '';
	export let isToggled = false;
	export let haveInput = true;
	export let haveToggle = true;
	export let isDisabled = false;
	export let onEnter: (() => void) | null = null;
	export let onInput: (() => void) | null = null;
	export let onBlur: (() => void) | null = null;
	export let toggleOn: (() => void) | null = null;
	export let toggleOff: (() => void) | null = null;
</script>

<div class="setting">
	<div class="description">
		<p>{description}</p>
		{#if help}
			<Help content={help} />
		{/if}
	</div>

	<div class="setting-inputs">
		<div style="grid-column: 1;">
			{#if haveInput}
				<NumberInput
					--input-w="90px"
					{id}
					{suffix}
					{onEnter}
					{onBlur}
					{onInput}
					placeholder="Значение"
					isDisabled={isDisabled || (haveToggle && !isToggled)}
					bind:value
				/>
			{/if}
		</div>
		<div style="grid-column: 2;">
			{#if haveToggle}
				<Switch on={toggleOn} off={toggleOff} bind:isToggled bind:isDisabled />
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.setting {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 20px;
		min-height: 42px;

		&-inputs {
			display: grid;
			grid-template-columns: 1fr 48px;
			align-items: center;
			gap: 30px;
		}
		& .description {
			display: flex;
			align-items: center;
			gap: 10px;
			flex: 1 1 0;
			max-width: 650px;

			& p {
				margin: 0;
				line-height: 1;
				font-size: 16px;
			}
		}
	}
</style>
