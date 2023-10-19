<script lang="ts">
	import pieIcon from '$lib/assets/pie_chart_icon.svg';
	import listIcon from '$lib/assets/list_icon.svg';
	import settingsIcon from '$lib/assets/settings_icon.svg';
	import eventIcon from '$lib/assets/event_icon.svg';
	import type { IRoute } from '$lib/interfaces';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import wheel from '$lib/stores/wheel';

	const routes: IRoute[] = [
		{ id: 0, title: 'Лоты', icon: listIcon, url: '/', element: null },
		{ id: 1, title: 'Колесо', icon: pieIcon, url: '/wheel', element: null },
		{ id: 2, title: 'События', icon: eventIcon, url: '/events', element: null },
		{ id: 3, title: 'Настройки', icon: settingsIcon, url: '/settings', element: null }
	];

	export let activeRoute: IRoute | undefined = routes.find((r) => r.url === $page.route.id);

	function handleRouteClick(route: IRoute) {
		if (activeRoute?.url === route.url) return;

		activeRoute = route;
		goto(route.url);
	}
</script>

<nav class="navigation">
	{#key activeRoute}
		<h2 transition:fade={{ duration: 300, easing: sineInOut }}>{activeRoute?.title}</h2>
	{/key}
	{#if activeRoute}
		<ul class="navigation-list" style="--select-left: {activeRoute?.id * 50}px">
			{#each routes as route, idx}
				<li bind:this={routes[idx].element}>
					<a
						href={route.url}
						class="navigation__route"
						class:active={route.url === activeRoute?.url}
						class:disabled={$wheel.isSpinning && route.id === 3}
						on:click={() => handleRouteClick(route)}
						draggable="false"
					>
						<div class="navigation-icon-wrapper">
							<img src={route.icon} alt="Navigation route icon" draggable="false" />
						</div>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>

<style lang="scss">
	.navigation {
		position: relative;
		border-radius: 10px;
		box-shadow: inset 0 2px 4px black;
		background-color: #0a0a0a;

		& h2 {
			position: absolute;
			top: -30px;
			left: 50%;
			translate: -50%;
			margin: 0;
			font-size: 18px;
			text-transform: uppercase;
		}

		&-list {
			display: flex;
			justify-content: center;
			align-items: end;
			margin: 0;
			padding: 0;
			list-style: none;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: var(--select-left, 0);
				width: 50px;
				height: 50px;
				border-radius: 10px;
				box-shadow: 0 2px 4px black;
				background-color: var(--color-purple);
				transition: 0.2s ease-in-out;
			}
		}

		&__route {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 10px;
			width: 30px;
			height: 30px;
			padding: 10px;
			border: none;
			text-decoration: none;
			overflow: hidden;
			color: white;
			user-select: none;
			transition: 0.3s;

			&.disabled:not(.active) {
				pointer-events: none;
				cursor: not-allowed;

				&:hover {
					opacity: 0.2;
				}
			}
			&:hover:not(.active) {
				opacity: 0.7;
			}

			&:not(.active) {
				cursor: pointer;
				opacity: 0.2;
			}

			& img {
				filter: invert(1) brightness(130%);
			}
		}

		&-icon-wrapper {
			display: flex;

			& img {
				transition: 0.2s;
			}
		}
	}
</style>
