<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Button from './Button.svelte';
	import Textarea from './Textarea.svelte';
	import downArrow from '$lib/assets/arrow_drop_down_icon.svg';
	import upArrow from '$lib/assets/arrow_drop_up_icon.svg';

	interface IDropdownEvents {
		optiondeleted: {
			index: number;
		};
		optionadded?: {
			index: number;
		};
	}

	const dispatch = createEventDispatcher<IDropdownEvents>();

	export let options: string[] = [];
	export let selectedOption = 0;
	export let titleText = options[selectedOption];
	export let isDropped = false;
	export let isReadonly = false;

	let isEditMode = false;
	let headElement: HTMLElement;
	let listElement: HTMLElement;
	let textareaElement: HTMLTextAreaElement;

	function addOption() {
		dispatch('optionadded', { index: options.length - 1 });
		selectedOption = options.length;
		isDropped = false;
		isEditMode = true;

		setTimeout(() => textareaElement.focus(), 100);
	}

	function deleteOption(index: number) {
		options = options.filter((_, idx) => idx !== index);

		selectedOption = 0;
		dispatch('optiondeleted', { index });
	}

	function selectOption(index: number) {
		if (index === selectedOption) return;

		selectedOption = index;
		isDropped = false;
	}

	function handleOutsideClick(e: Event) {
		const target = e.target as HTMLElement;

		if (target !== headElement && target !== listElement) {
			isDropped = false;
		}
	}
</script>

<svelte:document on:click={handleOutsideClick} />

<div class="dropdown" aria-hidden>
	<div class="dropdown-selected-wrapper">
		<div class="dropdown__item dropdown__item_head" bind:this={headElement} aria-hidden>
			<Textarea
				--textarea-align="center"
				--textarea-font-size="28px"
				--textarea-h="48px"
				id="dropdown-title"
				isResizable={true}
				{isReadonly}
				bind:isEditable={isEditMode}
				bind:element={textareaElement}
				bind:value={titleText}
			/>
			<button
				type="button"
				class="dropdown__button"
				on:click|stopPropagation={() => (isDropped = !isDropped)}
			>
				<img src={isDropped ? upArrow : downArrow} alt="Dropdown up arrow" draggable="false" />
			</button>
		</div>
	</div>
	{#if isDropped && options.length > 0}
		<ul
			class="dropdown__list"
			transition:slide={{ duration: 200, axis: 'y' }}
			bind:this={listElement}
		>
			{#each options as option, idx (idx)}
				<li
					class="dropdown__item"
					class:dropdown__item_selected={idx === selectedOption}
					aria-hidden
					on:click|stopPropagation={() => selectOption(idx)}
				>
					{option}
					<div style="position: absolute; top: 50%; right: 6px; translate: 0 -50%; display: flex;">
						<Button
							icon="delete"
							color={idx === selectedOption ? 'white' : 'black'}
							isDisabled={options.length < 2}
							on:click={() => deleteOption(idx)}
						/>
					</div>
				</li>
			{/each}
			{#if !isReadonly}
				<div style="display: flex; align-items: center; justify-content: center; margin-top: 10px;">
					<Button --button-size="100%" icon="plus" color="black" on:click={addOption} />
				</div>
			{/if}
		</ul>
	{/if}
</div>

<style lang="scss">
	.dropdown {
		position: relative;
		margin-bottom: 10px;
		width: 100%;
		font-size: 20px;
		border-radius: 5px;
		/* border: 1px solid var(--outline); */

		&-selected-wrapper {
			display: flex;
			flex-direction: column;
			padding: 5px 52px;
			gap: 10px;
		}

		&__item {
			position: relative;
			display: flex;
			flex-direction: column;
			min-height: 20px;
			font-weight: 700;
			text-align: center;
			transition: 0.2s;
			cursor: pointer;

			&_head {
				position: relative;
				width: 100%;
				border-radius: 5px;
				font-size: 28px;
				background-color: transparent;
				user-select: none;
			}

			&:not(:last-child)::after {
				content: '';
				position: absolute;
				left: 0;
				bottom: -1px;
				display: block;
				width: 100%;
				height: 1px;
				background-color: var(--outline-variant);
			}

			&:not(.dropdown__item_head) {
				padding: 10px 52px;
			}

			&_selected {
				color: var(--on-surface);
				background-color: var(--primary-50);
				cursor: default;
			}

			&:hover:not(.dropdown__item_head, .dropdown__item_selected) {
				background-color: var(--primary-70);
			}

			&:disabled {
				opacity: 0.3;
			}
		}

		&__button {
			position: absolute;
			top: 50%;
			right: -52px;
			translate: 0 -50%;
			display: flex;
			align-items: center;
			border: 0;
			height: 100%;
			/* padding: 0; */
			background-color: transparent;
			transition: 0.3s;
			cursor: pointer;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}

			&::before {
				content: '';
				position: absolute;
				left: 0;
				width: 1px;
				height: 100%;
				background-color: var(--outline);
			}
		}

		&__list {
			position: absolute;
			z-index: 999;
			left: 0;
			margin: 0;
			padding: 10px 0;
			border-radius: 5px;
			width: 100%;
			list-style-type: none;
			color: var(--on-inverse-surface);
			background-color: var(--inverse-surface);
			overflow: hidden;
		}
	}
</style>
