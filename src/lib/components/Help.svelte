<script lang="ts">
	import tooltip from '$lib/actions/tooltip';
	import helpIcon from '$lib/assets/help_icon.svg';

	export let content: string;
</script>

<div>
	<span class="help" use:tooltip={{ content }}>
		<img src={helpIcon} alt="Help" />
	</span>
</div>

<style lang="scss">
	.help {
		display: inline-block;
		height: 30px;

		& img {
			height: 100%;
			object-fit: contain;
		}
	}
</style>
