<script lang="ts">
	import tooltip from '$lib/actions/tooltip';
	import helpIcon from '$lib/assets/help_icon.svg';
	import type { Placement } from 'tippy.js';

	export let content: string;
	export let placement: Placement = 'right';
	export let interactive = true;
</script>

<div>
	<span class="help" use:tooltip={{ content, placement, interactive }}>
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
