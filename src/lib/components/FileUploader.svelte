<script lang="ts">
	import backgroundImage from '$lib/stores/backgroundImage';
	import TextButton from './TextButton.svelte';

	let error = '';

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;

		error = '';

		if (!target.files) return;
		if (target.files[0].size > 2 * 1024 * 1024) {
			error = 'Размер файла должен быть не больше ~2МБ';
			return;
		}

		const image = target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			if (!e.target) return;

			const imageUrl = e.target?.result;

			backgroundImage.set(`url(${imageUrl})`);
		};

		reader.readAsDataURL(image);
	}
</script>

<div class="file-uploader-wrapper">
	{#if error}
		<p class="file-uploader-error">{error}</p>
	{/if}
	<input type="file" id="file-uploader" accept="image/*" on:change={(e) => handleFileInput(e)} />
	<TextButton --text-b-fs="14px" text="Убрать Фон" on:click={() => backgroundImage.clear()} />
</div>

<style lang="scss">
	.file-uploader {
		&-wrapper {
			display: flex;
			align-items: center;
		}

		&-error {
			font-weight: 700;
			color: crimson;
			animation: pulse 0.5s forwards;
		}
	}

	@keyframes pulse {
		0% {
			color: white;
		}
		100% {
			color: var(--error);
		}
	}
</style>
