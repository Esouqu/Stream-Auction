<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import Button from './Button.svelte';
	import Textarea from './Textarea.svelte';
	import downArrow from '$lib/assets/arrow_drop_down_icon.svg';
	import upArrow from '$lib/assets/arrow_drop_up_icon.svg';
	import plusIconBlack from '$lib/assets/add_icon_black.svg';
	import deleteIcon from '$lib/assets/close_icon.svg';
	import deleteIconBlack from '$lib/assets/close_icon_black.svg';

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

		if (selectedOption !== 0) selectedOption -= 1;
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
				--textarea-border-radius="8px 0 0 8px"
				id="dropdown-title"
				isResizable={true}
				bind:isEditable={isEditMode}
				bind:element={textareaElement}
				bind:value={titleText}
			/>
			<div class="dropdown__button">
				<Button
					--button-w="100%"
					--button-border-radius="0"
					icon={isDropped ? upArrow : downArrow}
					iconSize="36px"
					color="transparent"
					hoverColor="black"
					on:click={() => (isDropped = !isDropped)}
				/>
			</div>
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
					{#if idx !== selectedOption}
						<div class="delete-button-wrapper">
							<Button
								icon={idx === selectedOption ? deleteIcon : deleteIconBlack}
								color="transparent"
								on:click={() => deleteOption(idx)}
							/>
						</div>
					{/if}
				</li>
			{/each}
			{#if !isReadonly}
				<div class="add-option-wrapper">
					<Button
						--button-w="100%"
						--button-border-radius="0"
						icon={plusIconBlack}
						color="transparent"
						hoverColor="black"
						on:click={addOption}
					/>
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
		border-radius: 8px 0 0 8px;

		&-selected-wrapper {
			display: flex;
			flex-direction: column;
			padding: 0px 46px;
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
				font-size: 28px;
				background-color: transparent;
				user-select: none;
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
				background-color: var(--hover-black);
			}

			&:disabled {
				opacity: 0.3;
			}
		}

		&__button {
			position: absolute;
			top: 50%;
			right: -46px;
			translate: 0 -50%;
			display: flex;
			align-items: center;
			border: 0;
			border-radius: 0 8px 8px 0;
			height: 100%;
			background-color: transparent;
			transition: 0.3s;
			cursor: pointer;

			&:hover {
				background-color: rgba(255, 255, 255, 0.1);
			}
		}

		&__list {
			position: absolute;
			z-index: 999;
			left: 0;
			margin: 0;
			padding: 10px 0;
			border-radius: 0 0 8px 8px;
			width: 100%;
			list-style-type: none;
			color: var(--on-inverse-surface);
			background-color: var(--inverse-surface);
			overflow: hidden;
		}
	}
	.delete-button-wrapper {
		position: absolute;
		top: 50%;
		right: 6px;
		translate: 0 -50%;
		display: flex;
	}
	.add-option-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 10px;
	}
</style>
