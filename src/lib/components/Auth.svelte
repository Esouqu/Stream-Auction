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

<div class={`${isLoggedIn ? 'auth_loggedIn' : 'auth'}`}>
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
		gap: 10px;
		padding: 20px;
		border-radius: 5px;
		background-color: var(--surface-container-highest);

		&-title-wrapper {
			display: flex;
			align-items: center;
			gap: 15px;
		}

		&_loggedIn {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
