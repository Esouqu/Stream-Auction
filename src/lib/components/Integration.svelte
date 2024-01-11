<script lang="ts">
	import Switch from './Switch.svelte';
	import TextButton from './TextButton.svelte';
	import daIcon from '$lib/assets/donationalerts-logo/DA_Alert_Color.svg';
	import twitchIcon from '$lib/assets/twitch-logo/TwitchGlitchPurple.svg';

	export let name: 'Donation Alerts' | 'Twitch';
	export let isAuthorized: Boolean;
	export let isToggled: boolean = false;
	export let isDisabled: boolean = false;
	export let onSwitchOn: () => void;
	export let onSwitchOff: () => void;
	export let authCallback: () => void;

	let icon = name === 'Twitch' ? twitchIcon : daIcon;
	let color: 'orange' | 'purple' = name === 'Twitch' ? 'purple' : 'orange';
</script>

<div class="integration">
	<div class="integration__title">
		<img src={icon} alt="{name} logo" />
		<p>{name}</p>
	</div>
	{#if isAuthorized}
		<Switch on={onSwitchOn} off={onSwitchOff} bind:isDisabled bind:isToggled />
	{:else}
		<TextButton text="Подключить" {color} on:click={authCallback} />
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
