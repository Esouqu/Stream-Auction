<script lang="ts">
	import Switch from './Switch.svelte';
	import TextButton from './TextButton.svelte';

	export let name: string;
	export let icon: string;
	export let color: 'orange' | 'purple';
	export let isAuthorized: Boolean;
	export let isToggled: boolean = false;
	export let isDisabled: boolean = false;
	export let onSwitchOn: () => void;
	export let onSwitchOff: () => void;
	export let authCallback: () => void;
</script>

<div class="integration">
	<div class="integration__title">
		<img src={icon} alt="{name} logo" />
		<p>{name}</p>
	</div>
	{#if isAuthorized}
		<Switch {color} on={onSwitchOn} off={onSwitchOff} bind:isDisabled bind:isToggled />
	{:else}
		<TextButton --text-b-fs="14px" text="Подключить" {color} on:click={authCallback} />
	{/if}
</div>

<style lang="scss">
	.integration {
		position: relative;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		gap: 10px;

		&__title {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		& p {
			margin: 0;
			text-align: center;
			font-size: 18px;
			font-weight: 600;
		}

		& img {
			height: 30px;
			object-fit: contain;
			transition: 0.2s;
		}
	}
</style>
