<script lang="ts">
	import { page } from '$app/stores';
	import { routes } from '$lib/constants';

	let selectorPosition: number;

	$: {
		if ($page.route.id) {
			const route = routes.find((r) => r.url === $page.route.id);

			selectorPosition = route?.id || 0;
		}
	}
</script>

<nav class="navigation">
	<ul class="navigation-list" style="--select-position: {selectorPosition * 50}px">
		{#each routes as route}
			<li
				class="navigation__item"
				class:active={route.url === $page.route.id}
				data-title={route.title}
			>
				<a href={route.url} class="navigation__route" draggable="false">
					<div class="icon-wrapper" style="width: 30px; height: 30px;">
						<img src={route.icon} alt="Navigation route icon" draggable="false" />
					</div>
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

		&__item {
			position: relative;
			transition: opacity 0.2s;

			&:not(.active) {
				& .navigation__route {
					opacity: 0.2;
					cursor: pointer;

					&:hover {
						opacity: 0.7;
					}
				}
			}

			&:not(.active):hover::after {
				opacity: 1;
			}

			&::after {
				content: attr(data-title);
				position: absolute;
				bottom: -46px;
				left: 50%;
				translate: -50% 0px;
				z-index: 999;
				margin: 0;
				padding: 5px 10px;
				border-radius: 5px;
				font-weight: 700;
				letter-spacing: 0.5px;
				text-transform: uppercase;
				color: var(--on-inverse-surface);
				background-color: var(--inverse-surface);
				opacity: 0;
				transition: opacity 0.2s;
				pointer-events: none;
			}
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
				left: var(--select-position, 0);
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
			color: white;
			transition: opacity 0.3s;
			user-select: none;
			cursor: default;
		}
	}
</style>
