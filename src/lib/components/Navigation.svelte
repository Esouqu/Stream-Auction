<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { routes } from '$lib/constants';
	import { onMount } from 'svelte';

	let selectorPosition = 0;

	// onMount(() => setSelectorPosition());

	function setSelectorPosition() {
		selectorPosition = $page.route.id === '/' ? 0 : 50;
	}
</script>

<nav class="navigation">
	<ul class="navigation-list" style="--select-left: {$page.route.id === '/' ? 0 : 50}px">
		{#each routes as route}
			<li>
				<a
					href={route.url}
					class="navigation__route"
					class:active={route.url === $page.route.id}
					title={route.title}
					draggable="false"
				>
					<div class="navigation-icon-wrapper">
						<img src={route.icon} alt="Navigation route icon" draggable="false" />
					</div>
					<!-- <h2>{route.title}</h2> -->
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	.navigation {
		position: relative;
		border-radius: 10px;
		box-shadow: inset 0 2px 4px black;
		background-color: var(--surface-container);

		& h2 {
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
