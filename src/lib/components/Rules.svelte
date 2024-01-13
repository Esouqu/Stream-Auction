<script lang="ts">
	import presets from '$lib/stores/presets';
	import storable from '$lib/stores/storable';
	import Dropdown from './Dropdown.svelte';
	import Textarea from './Textarea.svelte';

	let selectedPreset = storable(0, 'selectedPreset');
</script>

<div class="rules">
	<Dropdown
		options={$presets.map((p) => p.title)}
		isEditable={true}
		bind:selectedOption={$selectedPreset}
		bind:titleText={$presets[$selectedPreset].title}
		on:optiondeleted={(e) => presets.remove(e.detail.index)}
		on:optionadded={() => presets.create()}
	/>
	<Textarea
		id="rules"
		placeholder="Написать правила..."
		bind:value={$presets[$selectedPreset].text}
	/>
</div>

<style lang="scss">
	.rules {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
		width: 100%;
	}
</style>
