<div class="circle-wrapper">
	<div class="circle" />
</div>

<style lang="scss">
	.circle {
		height: var(--spinner-size, 25px);
		width: var(--spinner-size, 25px);
		border-color: var(--primary-60) var(--primary-60) transparent transparent;
		border-width: calc(var(--spinner-size) / 10);
		border-style: solid;
		border-image: initial;
		border-radius: 50%;
		animation: 1s linear 0s infinite normal none running rotate;

		&-wrapper {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
		}
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
