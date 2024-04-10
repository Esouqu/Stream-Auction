<script lang="ts">
	export let isActive = false;
</script>

<div class="indicator" class:active={isActive} />

<style lang="scss">
	.indicator {
		position: relative;
		z-index: 1;
		border-radius: 100%;
		width: 10px;
		height: 10px;

		&.active {
			&::before {
				animation: pulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
			}

			&::after {
				background-color: var(--primary-60);
			}
		}

		&::before {
			content: '';
			position: absolute;
			z-index: 0;
			top: 50%;
			left: 50%;
			translate: -50% -50%;
			scale: 0;
			border-radius: 100%;
			width: 300%;
			height: 300%;
			background-color: var(--primary-70);
			opacity: 1;
		}

		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			border-radius: 100%;
			width: 100%;
			height: 100%;
			background-color: var(--neutral);
			transition: 0.2s;
		}
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			scale: 0;
		}
		100% {
			opacity: 0;
			scale: 1;
		}
	}
</style>
