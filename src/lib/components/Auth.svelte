<script lang="ts">
	import TextButton from './TextButton.svelte';

	export let icon: string;
	export let title: string;
	export let isLoggedIn: boolean;
	export let onLogout: () => void;
	export let onLogIn: () => void;

	function handleClick() {
		!isLoggedIn ? onLogIn() : onLogout();
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
		// padding: 20px;
		border-radius: 5px;
		// background-color: var(--surface-container-highest);

		&-title-wrapper {
			display: flex;
			align-items: center;
			gap: 10px;
		}

		&_loggedIn {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
</style>
