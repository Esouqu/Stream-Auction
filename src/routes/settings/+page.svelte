<script lang="ts">
	import { slide } from 'svelte/transition';
	import donations from '$lib/stores/donations';
	import timer from '$lib/stores/timer';
	import FileUploader from '$lib/components/FileUploader.svelte';
	import Setting from '$lib/components/Setting.svelte';
	import RangeSlider from '$lib/components/RangeSlider.svelte';
	import background from '$lib/stores/background';
	import Input from '$lib/components/Input.svelte';
	import TextButton from '$lib/components/TextButton.svelte';

	let videoUrl: string;

	$: continueSpinAction = donations.continueSpinAction;
	$: stopSpinAction = donations.stopSpinAction;
	$: currentSpinPrice = donations.currentSpinPrice;
	$: baseTime = timer.baseTime;
	$: itemAddedAction = timer.itemAddedAction;
	$: leaderChangedAction = timer.leaderChangedAction;
	$: backgroundImage = background.image;
	$: backgroundVideo = background.video;
	$: backgroundTransparency = background.transparency;
</script>

<svelte:head>
	<title>Настройки - Аукцион</title>
</svelte:head>

<section class="settings-section">
	<div class="toggles-wrapper">
		<div class="toggles toggles_bg">
			<div class="bg-setting">
				<p>Картинка</p>
				<FileUploader />
			</div>
			<div class="bg-setting">
				<p>Видео</p>
				<Input
					--input-w="100%"
					--input-w-w="100%"
					id="video-url"
					type="text"
					placeholder="Ссылка"
					onEnter={() => videoUrl && background.setVideo(videoUrl)}
					onInput={() => videoUrl && background.setVideo(videoUrl)}
					onBlur={() => videoUrl && background.setVideo(videoUrl)}
					bind:value={videoUrl}
				/>
			</div>
			<div class="bg-setting">
				<p>Прозрачность интерфейса</p>
				<div style="display: flex; align-items: center;">
					<RangeSlider
						min={0.1}
						max={1}
						step={0.05}
						isDisabled={!$backgroundImage && !$backgroundVideo}
						bind:value={$backgroundTransparency}
					/>
					<span style="width: 50px; text-align: end;">{$backgroundTransparency}</span>
				</div>
			</div>
			<div style="margin-top: 20px;">
				<TextButton --text-b-fs="14px" text="Убрать Фон" on:click={() => background.resetAll()} />
			</div>
		</div>
		<div class="toggles toggles_timer">
			<Setting
				id={5}
				description="Стартовое время"
				suffix="Мин"
				isDisabled={$timer.isRunning}
				haveToggle={false}
				onInput={() => timer.setInitialTime($baseTime)}
				bind:value={$baseTime}
			/>
			<Setting
				id={6}
				description="Добавлять время за новый лот"
				suffix="Сек"
				bind:isToggled={$itemAddedAction.isEnabled}
				bind:value={$itemAddedAction.seconds}
			/>
			<Setting
				id={7}
				description="Добавлять время за смену лидера"
				suffix="Сек"
				bind:isToggled={$leaderChangedAction.isEnabled}
				bind:value={$leaderChangedAction.seconds}
			/>
		</div>
		<div class="toggles toggles_wheel">
			<Setting
				id="wheel-2"
				description="Остановить, добавив вариант"
				suffix="Руб"
				bind:isToggled={$stopSpinAction.isEnabled}
				bind:value={$stopSpinAction.price}
			/>
			<Setting
				id="wheel-3"
				description="Продлить кручение"
				suffix="Руб"
				onInput={() => currentSpinPrice.set($continueSpinAction.price)}
				bind:isToggled={$continueSpinAction.isEnabled}
				bind:value={$continueSpinAction.price}
			/>
			{#if $continueSpinAction.isEnabled}
				<div class="toggles-options" transition:slide={{ duration: 200, axis: 'y' }}>
					<Setting
						id="wheel-4"
						description="Длительность продления"
						suffix="Сек"
						haveToggle={false}
						bind:value={$continueSpinAction.seconds}
					/>
					<Setting
						id="wheel-5"
						description="Увеличениe минимальной суммы за продление"
						suffix="Руб"
						haveToggle={false}
						bind:value={$continueSpinAction.step}
					/>
				</div>
			{/if}
		</div>
	</div>
</section>

<style lang="scss">
	.settings-section {
		/* position: absolute; */
		display: flex;
		flex: 1;
		flex-direction: column;
		padding: 0 30px;
		scrollbar-gutter: stable;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.bg-setting {
		display: flex;
		flex-direction: column;
	}
	.toggles-wrapper {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}
	.toggles {
		display: flex;
		flex-direction: column;

		&-options {
			position: relative;
			display: flex;
			flex-direction: column;
			padding-left: 15px;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				border-radius: 5px;
				width: 3px;
				height: 100%;
				border-radius: 10px;
				background-color: var(--primary-70);
			}
		}

		&::before {
			content: '';
			margin: 8px 0;
			font-size: 20px;
			font-weight: 600;
		}

		&_wheel::before {
			content: 'Колесо';
		}
		&_timer::before {
			content: 'Таймер';
		}
		&_bg {
			&::before {
				content: 'Фоновое Изображение';
			}
		}
	}
</style>
