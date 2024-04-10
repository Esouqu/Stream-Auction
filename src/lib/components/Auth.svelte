<script lang="ts">
	import { goto } from '$app/navigation';
	import TextButton from './TextButton.svelte';

	export let icon: string;
	export let title: string;
	export let url: string;
	export let isLoggedIn: boolean;
	export let onLogout: () => void;

	function handleClick() {
		!isLoggedIn ? goto(url) : onLogout();
	}
</script>

<div class="auth">
	<div class="auth-title-wrapper">
		<div class="icon-wrapper">
			<img src={icon} alt="{title} Brand Icon" />
		</div>
		<h3 class="medium-title">{title}</h3>
	</div>
	<TextButton text={isLoggedIn ? 'Выйти' : 'Подключить'} on:click={handleClick} />
</div>

<style lang="scss">
	.auth {
		display: flex;
		align-items: center;
		justify-content: space-between;

		&-title-wrapper {
			display: flex;
			align-items: center;
			gap: 15px;
		}
	}
</style>
