<script lang="ts">
	import { slide } from 'svelte/transition';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	export let options: string[] = [];
	export let selectedOption: string = options.length > 0 ? options[0] : 'Нет доступных пресетов';
	export let isActive = false;

	let selectedElement: HTMLElement;
	let listElement: HTMLElement;
	let presetNameInput: HTMLInputElement;
	let newPresetName: string;
	let isEditMode = false;

	function handlePresetCreation() {
		if (presetNameInput) {
			// presets.create(presetNameInput)
		}

		isEditMode = false;
	}

	function handleOptionClick(option: string) {
		selectedOption = option;
	}

	function handleOutsideClick(e: Event) {
		const target = e.target as HTMLElement;

		if (target !== selectedElement && target !== listElement) {
			isActive = false;
		}
	}
</script>

<svelte:document on:click={(e) => handleOutsideClick(e)} />

<div class="dropdown">
	<div class="dropdown-selected-wrapper">
		<div
			bind:this={selectedElement}
			class="dropdown__item dropdown__item_selected"
			class:active={isActive}
			on:click={() => (isActive = !isActive)}
			aria-hidden
		>
			{#if isEditMode}
				<Input
					--input-w="90%"
					id="presets-edit"
					type="text"
					placeholder="Название пресета"
					bind:value={newPresetName}
					onEnter={handlePresetCreation}
				/>
			{:else}
				{selectedOption !== '' ? selectedOption : 'Нет доступных пресетов'}
			{/if}
		</div>
	</div>
	{#if isActive}
		<ul
			class="dropdown__list"
			transition:slide={{ duration: 200, axis: 'y' }}
			bind:this={listElement}
		>
			{#each options as option}
				<li
					class="dropdown__item"
					class:dropdown__item_disabled={selectedOption === option}
					on:click={() => handleOptionClick(option)}
					aria-hidden
				>
					{option}
					<div style="position: absolute; top: 50%; right: 10px; translate: 0 -50%;">
						<Button icon="delete" color="white" />
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style lang="scss">
	.dropdown {
		position: relative;

		&-buttons-wrapper {
			display: flex;
		}
		&-selected-wrapper {
			display: flex;
			align-items: center;
			gap: 10px;
		}
		&__item {
			position: relative;
			padding: 5px 10px;
			font-size: 20px;
			font-weight: 700;
			text-align: center;
			color: black;
			background-color: white;
			transition: 0.2s;
			cursor: pointer;

			&_selected {
				position: relative;
				color: white;
				background-color: var(--color-orange);
				width: 100%;

				&::after {
					content: '';
					position: absolute;
					top: 50%;
					right: 10px;
					translate: 0 -50%;
					width: 0;
					height: 0;
					border-top: 8px solid white;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
					transition: 0.3s;
				}

				&.active::after {
					border-top: 0;
					border-bottom: 8px solid white;
				}
			}
			&_disabled {
				color: white;
				background-color: var(--color-orange);
				cursor: default;
			}

			&:hover:not(.dropdown__item_disabled) {
				color: white;
				background-color: var(--color-orange);
			}
		}
		&__list {
			position: absolute;
			z-index: 999;
			top: 40px;
			left: 0;
			margin: 0;
			padding: 0;
			width: 100%;
			list-style-type: none;
			overflow: hidden;
		}
	}
</style>
