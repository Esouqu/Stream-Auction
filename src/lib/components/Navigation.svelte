<script lang="ts">
	import type { IRoute } from '$lib/interfaces';
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import { routes } from '$lib/constants';
	import { createEventDispatcher } from 'svelte';

	interface INavigationEvents {
		routeswitch: {
			from: IRoute;
			to: IRoute;
		};
	}

	const dispatch = createEventDispatcher<INavigationEvents>();
	export let activeRoute: IRoute | undefined = routes.find((r) => r.url === $page.route.id);

	function handleRouting(route: IRoute, event: MouseEvent) {
		if (route.id === activeRoute?.id || event.ctrlKey || event.altKey || event.shiftKey) return;

		const previousRoute = activeRoute;
		activeRoute = route;

		if (previousRoute) {
			dispatch('routeswitch', { from: previousRoute, to: activeRoute });
		}
	}
</script>

<nav class="navigation">
	{#key activeRoute}
		<h2 in:fade={{ duration: 300, easing: sineInOut }}>{activeRoute?.title}</h2>
	{/key}
	{#if activeRoute}
		<ul class="navigation-list" style="--select-left: {activeRoute?.id * 50}px">
			{#each routes as route}
				<li>
					<a
						href={route.url}
						class="navigation__route"
						class:active={route.url === activeRoute?.url}
						draggable="false"
						on:click={(e) => handleRouting(route, e)}
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
		margin-top: 40px;
		border-radius: 10px;
		box-shadow: inset 0 2px 4px black;
		background-color: var(--surface-container);

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
				box-shadow: var(--elevation-1);
				background-color: var(--primary-50);
				transition: left 0.2s ease-in-out;
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
			transition: opacity 0.3s;
			cursor: default;

			&:hover:not(.active) {
				opacity: 0.7;
			}

			&:not(.active) {
				cursor: pointer;
				opacity: 0.2;
			}
		}

		&-icon-wrapper {
			display: flex;

			& img {
				width: 100%;
				object-fit: contain;
				transition: 0.2s;
			}
		}
	}
</style>
