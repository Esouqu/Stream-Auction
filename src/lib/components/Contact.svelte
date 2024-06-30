<script lang="ts">
	import Icon from './Icon.svelte';

	export let title: string;
	export let icon: string;
	export let url: string = '';
</script>

<a href={url} target="_blank" class="contact" class:clickable={!!url}>
	<Icon src={icon} />
	<div class="contact-title">
		{title}
	</div>
</a>

<style lang="scss">
	.contact {
		position: relative;
		display: flex;
		align-items: center;
		gap: 6px;
		transition: 0.2s;
		pointer-events: none;
		text-decoration: none;

		&.clickable {
			pointer-events: all;

			& .contact-title::before {
				content: '';
				position: absolute;
				left: 50%;
				bottom: 0;
				z-index: -1;
				translate: -50% 0;
				border-radius: 2px;
				width: 100%;
				padding: 0 3px;
				height: 2px;
				background-color: var(--primary-50);
				transition: ease-out 0.2s;
			}

			&:hover .contact-title::before {
				height: 100%;
			}
		}
		&-title {
			position: relative;
			z-index: 0;
			font-size: 14px;
			font-weight: 500;
			letter-spacing: 0.7px;
			color: var(--on-surface);
		}
	}
</style>
