<div class="circle" />

<style>
	.circle {
		position: absolute;
		left: -8px;
		height: var(--loader-size);
		width: var(--loader-size);
		border-color: var(--loader-color) transparent var(--loader-color) var(--loader-color);
		border-style: solid;
		border-image: initial;
		border-radius: 50%;
		animation: var(--loader-dur) linear 0s infinite normal none running rotate;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
