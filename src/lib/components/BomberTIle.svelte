<script lang="ts">
	import getIcon from '$lib/icons';
	import type { BomberTileType } from '$lib/interfaces';

	// export let position: IPoint;
	export let id: number;
	export let type: BomberTileType;
	export let isFlipped: boolean;
	export let isDisabled: boolean = false;
	export let isInteractable: boolean = true;
</script>

<div
	class="tile-wrapper"
	class:flipped={isFlipped}
	class:disabled={isDisabled}
	class:interactable={isInteractable}
	aria-hidden
	on:click
>
	<div class="tile">
		<div class="tile-front">
			<span>{id}</span>
		</div>
		<div class="tile-back" data-type={type}>
			<div class="tile-image-wrapper">
				<img
					class="tile__image"
					src={getIcon(type === 'bomb' ? 'bomb' : 'emerald')}
					alt={type === 'bomb' ? 'bomb' : 'emerald'}
					draggable="false"
				/>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.tile {
		position: relative;
		width: 100%;
		height: 100%;
		text-align: center;
		transition: transform 0.5s;
		transform-style: preserve-3d;

		&-wrapper {
			width: 100%;
			height: 100%;
			border-radius: 10px;

			perspective: 1000px; /* Remove this if you don't want the 3D effect */
			background-color: transparent;
			pointer-events: none;
			user-select: none;
			cursor: pointer;
			transition: 0.2s;

			/* &:hover .tile {
				transform: rotateY(180deg) scale(1.5);
			} */

			&.interactable {
				pointer-events: all;
				/* transition: 0.2s; */

				&:hover {
					scale: 1.05;
				}

				&:active {
					scale: 1;
				}
			}

			&.flipped {
				z-index: 9999;

				& .tile {
					transform: rotateY(180deg);
				}
				& .tile__image {
					animation: flip 0.5s forwards ease-in-out;
				}
			}

			&.disabled {
				transition: 0.2s;
				filter: grayscale(0.5) brightness(50%);
			}
		}

		&-front,
		&-back {
			position: absolute;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			border-radius: 10px;
			box-shadow: 0 2px 10px black;
			-webkit-backface-visibility: hidden; /* Safari */
			backface-visibility: hidden;
		}

		/* Style the front side (fallback if image is missing) */
		&-front {
			background-image: linear-gradient(45deg, transparent, #4f4f4f 50%);
		}

		/* Style the back side */
		&-back {
			transform: rotateY(180deg);

			&[data-type='coin'] {
				background-image: linear-gradient(
					225deg,
					var(--color-orange) 0%,
					#ff952d 50%,
					#f57d0700 100%
				);
			}

			&[data-type='bomb'] {
				background-image: linear-gradient(45deg, crimson 50%, rgba(255, 0, 51, 0.1) 100%);
			}
		}

		&-image-wrapper {
			display: flex;
			padding: 15px;

			& img {
				width: 100%;
				object-fit: contain;
				filter: drop-shadow(0 4px 5px rgb(0 0 0 / 50%));
			}
		}

		& span {
			line-height: 1;
			font-size: 32px;
			font-weight: 700;
			text-transform: uppercase;
			user-select: none;
		}
	}

	@keyframes flip {
		0% {
			transform: scale(0.5);
		}
		70% {
			transform: scale(1.75);
		}
		100% {
			transform: scale(1);
		}
	}
	/* .tile {
		&-wrapper {
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 10px;
			box-shadow: 0 2px 10px black;
			background-image: linear-gradient(45deg, transparent, #4f4f4f 50%);
			pointer-events: none;
			user-select: none;
			transition: 0.2s;
			cursor: pointer;

			&.interactable {
				pointer-events: all;

				&:hover {
					scale: 1.05;
				}

				&:active {
					scale: 1;
				}
			}
			&.flipped {
				&[data-type='coin'] {
					background-image: linear-gradient(
						225deg,
						var(--color-orange) 0%,
						#ff952d 50%,
						#f57d0700 100%
					);
				}
				&[data-type='bomb'] {
					background-image: linear-gradient(45deg, crimson 50%, rgba(255, 0, 51, 0.1) 100%);
				}
			}
			&.disabled {
				filter: grayscale(0.5) brightness(50%);
			}
		}

		&-image-wrapper {
			display: flex;
			padding: 10px;

			& img {
				width: 100%;
				object-fit: contain;
				filter: drop-shadow(0 4px 5px rgb(0 0 0 / 50%));
			}
		}

		& span {
			line-height: 1;
			font-size: 32px;
			font-weight: 700;
			text-transform: uppercase;
		}
	} */
</style>
