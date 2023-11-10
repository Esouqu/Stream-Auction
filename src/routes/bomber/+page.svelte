<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import BomberTile from '$lib/components/BomberTIle.svelte';
	import RangeSlider from '$lib/components/RangeSlider.svelte';
	import TextButton from '$lib/components/TextButton.svelte';
	import type { BomberTileType } from '$lib/interfaces';
	import donations from '$lib/stores/donations';
	import { getTotal, shuffleArray } from '$lib/utils';

	enum GAME_STATE {
		READY = 'Ready',
		BUSY = 'Busy',
		WAITING = 'Waiting',
		GAME_OVER = 'Game Over'
	}

	const maxMultipliers = [3, 9, 16, 27, 35];
	const bombsAmount = [1, 4, 8, 12, 15];
	const maxTiles = 16;
	const minTotalMultiplier = 1;

	let gameState = GAME_STATE.READY;
	let donation: { id: number; value: number; username: string };
	let openedTiles: number[] = [];
	let bombsId = 0;
	let totalMultiplier = minTotalMultiplier;
	let isGridHovered = false;

	$: currentBombsAmount = bombsAmount[bombsId];
	$: multiplier = getMultiplier(currentBombsAmount);
	$: tiles = generateGrid(currentBombsAmount);

	function endGame() {
		switchState(GAME_STATE.BUSY);

		setTimeout(() => {
			switchState(GAME_STATE.GAME_OVER);
		}, 500);
	}

	function resetGame() {
		switchState(GAME_STATE.READY);
	}

	function getMultiplier(bombs: number) {
		const coinsAmount = maxTiles - bombs;
		const oneCoinCost = maxMultipliers[bombsId] / coinsAmount;

		return Number(oneCoinCost.toFixed(2));
	}

	function multiplyDonation() {
		donations.setValue(donation.id, Math.round(donation.value * totalMultiplier));
		endGame();
	}

	function handleTileClick(idx: number, type: BomberTileType) {
		if (gameState !== GAME_STATE.WAITING) return;

		openedTiles = [...openedTiles, idx];
		totalMultiplier = Number((totalMultiplier + multiplier).toFixed(2));

		if (type === 'bomb') {
			totalMultiplier = 0;
			donations.remove(donation.id);
			endGame();

			return;
		}
	}

	function switchState(state: GAME_STATE) {
		switch (state) {
			case GAME_STATE.READY: {
				gameState = GAME_STATE.READY;
				break;
			}
			case GAME_STATE.BUSY: {
				gameState = GAME_STATE.BUSY;
				break;
			}
			case GAME_STATE.WAITING: {
				openedTiles = [];
				totalMultiplier = minTotalMultiplier;
				gameState = GAME_STATE.WAITING;
				gameState = GAME_STATE.BUSY;

				setTimeout(() => {
					tiles = shuffleArray(tiles);
					gameState = GAME_STATE.WAITING;
				}, 300);

				break;
			}
			case GAME_STATE.GAME_OVER: {
				gameState = GAME_STATE.GAME_OVER;
				break;
			}
			default: {
				gameState = GAME_STATE.READY;
			}
		}
	}

	function generateGrid(bombs: number) {
		const outArray: BomberTileType[] = [];

		for (let i = 0; i < bombs; i++) {
			outArray.push('bomb');
		}
		for (let i = 0; i < maxTiles - bombs; i++) {
			outArray.push('coin');
		}

		return outArray;
	}

	function handleDrop(e: DragEvent) {
		const data = e.dataTransfer?.getData('application/json');
		if (!data || !isValidData(e) || gameState !== GAME_STATE.READY) return;

		donation = JSON.parse(data);

		switchState(GAME_STATE.WAITING);
		isGridHovered = false;
	}

	function handleDragOver(e: DragEvent) {
		if (isValidData(e) && gameState === GAME_STATE.READY) isGridHovered = true;
	}

	function handleDragLeave(e: DragEvent) {
		if (isValidData(e) && gameState === GAME_STATE.READY) isGridHovered = false;
	}

	function isValidData(e: DragEvent) {
		const data = e.dataTransfer;
		if (!data) return false;

		return data.types.includes('application/json');
	}
</script>

<svelte:head>
	<title>Бомбер - Аукцион</title>
</svelte:head>

<section class="bomber-section">
	<div class="bomber-section-cell" style="justify-content: end; gap: 20px;">
		{#if gameState === GAME_STATE.READY}
			<p class="bomber__note">
				Каждый открытый гем увеличивает конечный множитель<br /> на велечину, зависимую от количества
				бомб
			</p>
			<p class="bomber__note">
				Если вы открыли бомбу, то игра заканчивается обнуляя донат <br /> с которым была запущенна игра
			</p>
			<p class="bomber__note">Перетащите карточку доната поверх поля и отпустите, чтобы начать</p>
		{/if}
		{#if gameState === GAME_STATE.WAITING}
			<p class="bomber__note">
				Нажмите [ЗАВЕРШИТЬ], чтобы умножить сумму доната <br /> на текущий множитель и закончить игру
			</p>
		{/if}
	</div>

	<div class="grid-wrapper">
		<div style="flex: 1;" />
		<div
			class="grid"
			class:hovered={isGridHovered}
			class:busy={gameState === GAME_STATE.BUSY}
			class:no-hint={gameState !== GAME_STATE.READY}
			on:dragover|preventDefault={(e) => handleDragOver(e)}
			on:dragleave|preventDefault={(e) => handleDragLeave(e)}
			on:drop|preventDefault={(e) => handleDrop(e)}
			aria-hidden
		>
			{#each [...tiles].reverse() as type, idx}
				<BomberTile
					id={idx + 1}
					{type}
					isFlipped={gameState === GAME_STATE.WAITING || gameState === GAME_STATE.BUSY
						? openedTiles.includes(idx)
						: true}
					isDisabled={gameState === GAME_STATE.GAME_OVER ? !openedTiles.includes(idx) : false}
					isInteractable={gameState === GAME_STATE.WAITING && !openedTiles.includes(idx)}
					on:click={() => handleTileClick(idx, type)}
				/>
			{/each}
		</div>
		<div class="bomber-section-cell bomber-section-cell_options">
			{#if gameState !== GAME_STATE.READY}
				<div>
					<h2 class="bomber__title">Множитель</h2>
					<h2 style="margin: 0; font-size: 40px; line-height: 40px; text-align: center;">
						X{totalMultiplier}
					</h2>
				</div>
			{/if}
			{#if gameState === GAME_STATE.READY}
				<div>
					<h2 class="bomber__title">Количество <br /> бомб</h2>
					<div
						style="display: flex; flex-direction: row; align-items: center; justify-content: center;"
					>
						<Button
							icon="upArrow"
							on:click={() => (bombsId += 1)}
							isDisabled={bombsId >= bombsAmount.length - 1}
						/>
						<h2 class="bomber__bombs">{currentBombsAmount}</h2>
						<!-- <RangeSlider min={0} max={bombsAmount.length - 1} bind:value={bombsId} /> -->
						<Button icon="downArrow" on:click={() => (bombsId -= 1)} isDisabled={bombsId <= 0} />
					</div>
				</div>

				<div>
					<h2 class="bomber__title">Множитель <br /> за 1 гем</h2>
					<h2 style="margin: 0; line-height: 40px; text-align: center;">X{multiplier}</h2>
				</div>
			{/if}
		</div>
	</div>

	<div class="bomber-section-cell">
		{#if gameState === GAME_STATE.GAME_OVER}
			<TextButton --text-b-fs="18px" text="Новая Игра" color="orange" on:click={resetGame} />
		{:else if gameState === GAME_STATE.WAITING}
			<TextButton --text-b-fs="18px" color="red" text="Завершить" on:click={multiplyDonation} />
		{/if}
	</div>
</section>

<style lang="scss">
	.grid-wrapper {
		display: flex;
	}
	.bomber {
		&-section {
			display: flex;
			flex-direction: column;
			width: 100%;
			padding: 0 30px;

			&-cell {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				flex: 1;

				&_options {
					gap: 20px;
				}
			}
		}
		&__bombs {
			width: 40px;
			margin: 0px;
			text-align: center;
			font-variant-numeric: tabular-nums;
		}

		&__note {
			margin: 0;
			text-align: center;
			line-height: 1;
			font-size: 18px;
			white-space-collapse: pre-line;
		}

		&__title {
			margin: 5px;
			font-size: 20px;
			text-align: center;
			text-transform: uppercase;
		}
	}
	.grid {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, 100px);
		grid-template-rows: repeat(4, 100px);
		gap: 10px;
		border: 0;
		padding: 20px;
		opacity: 1;
		transition: 0.3s;

		&.hovered {
			/* background-color: rgb(255 255 255 / 40%); */
			border-radius: 10px;
			scale: 0.9;

			&::after {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				width: 100%;
				height: 100%;
				font-size: 48px;
				font-weight: 700;
				scale: 1.1;
				opacity: 0.5;
				background-color: var(--color-orange);
			}
		}
		&::after {
			content: '';
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
			font-size: 48px;
			font-weight: 700;
			scale: 1.1;
			opacity: 0.5;
			background-color: transparent;
			transition: 0.3s;
		}
	}
</style>
