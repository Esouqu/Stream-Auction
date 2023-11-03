<script lang="ts">
	import TextButton from './TextButton.svelte';

	let error = '';

	function handleClear() {
		if (!localStorage.getItem('bgImage')) return;

		const backgroundElement = document.querySelector('body');
		backgroundElement!.style.backgroundImage = '';
		localStorage.removeItem('bgImage');
	}

	function handleFileInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const backgroundElement = document.querySelector('body');
		error = '';

		if (!target.files) return;
		if (target.files[0].size > 2 * 1024 * 1024) {
			error = 'Размер файла должен быть не больше 2МБ';
			return;
		}

		const image = target.files[0];
		const reader = new FileReader();

		reader.onload = (e) => {
			if (!e.target) return;

			const imageUrl = e.target?.result;

			backgroundElement!.style.backgroundImage = `url(${imageUrl})`;
			localStorage.setItem('bgImage', JSON.stringify(imageUrl));
		};

		reader.readAsDataURL(image);
	}
</script>

<div class="file-uploader-wrapper">
	{#if error}
		<p class="file-uploader-error">{error}</p>
	{/if}
	<input type="file" id="file-uploader" accept="image/*" on:change={(e) => handleFileInput(e)} />
	<TextButton --text-b-fs="14px" text="Очистить" on:click={handleClear} />
</div>

<style lang="scss">
	.file-uploader {
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
			color: crimson;
		}
	}
</style>
