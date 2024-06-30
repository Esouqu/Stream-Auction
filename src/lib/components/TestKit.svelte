<script lang="ts">
	import actionManager from '$lib/stores/actionManager';
	import lots from '$lib/stores/lots';
	import { getRandomInRange } from '$lib/utils';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import NumberInput from './NumberInput.svelte';
	import TextButton from './TextButton.svelte';
	import Textarea from './Textarea.svelte';
	import settingsIcon from '$lib/assets/settings_icon.svg';
	import { fly } from 'svelte/transition';
	import settings from '$lib/stores/settings';

	const currency = 'RUB';

	let amount = 30;
	let username = 'Tester';
	let message = 'test';
	let lotsToAdd = 10;
	let isShown = false;

	$: stopSpinAction = settings.stopSpinAction;
	$: currentExtendSpinPrice = settings.currentExtendSpinPrice;

	function fireExtendSpinEvent() {
		actionManager.processDonation({
			id: Math.floor(Math.random() * 100000),
			username: username || 'Аноним',
			type: 'Donation Alerts',
			message,
			amount: $currentExtendSpinPrice,
			amount_in_user_currency: $currentExtendSpinPrice,
			currency,
			created_at: Date.now().toString()
		});
	}

	function fireStopSpinEvent() {
		const messages = ['#1', 'test'];
		const messageIdx = Math.floor(Math.random() * messages.length);

		actionManager.processDonation({
			id: getRandomInRange(1, 100000),
			username: username || 'Аноним',
			type: 'Donation Alerts',
			message: messages[messageIdx],
			amount: $stopSpinAction.price,
			amount_in_user_currency: $stopSpinAction.price,
			currency,
			created_at: Date.now().toString()
		});
	}

	function donateRandom() {
		const randomAmount = getRandomInRange(1, 4);
		let count = 0;

		const intervalId = setInterval(() => {
			if (count >= randomAmount) {
				clearInterval(intervalId);
				return;
			}

			actionManager.processDonation({
				id: getRandomInRange(1, 100000),
				username: username || 'Аноним',
				type: 'Donation Alerts',
				message: $lots[getRandomInRange(0, $lots.length - 1)].title,
				amount: getRandomInRange(30, 300),
				amount_in_user_currency: getRandomInRange(30, 300),
				currency,
				created_at: Date.now().toString()
			});

			count++;
		}, 100);
	}
	function donate() {
		if (!amount) return;

		actionManager.processDonation({
			id: getRandomInRange(1, 100000),
			username: username || 'Аноним',
			type: 'Donation Alerts',
			message,
			amount: amount,
			amount_in_user_currency: amount,
			currency,
			created_at: Date.now().toString()
		});
	}

	function generateRandomWord(length: number) {
		const charset = 'abcdefghijklmnopqrstuvwxyz';
		let randomWord = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * charset.length);
			randomWord += charset.charAt(randomIndex);
		}

		return randomWord;
	}

	function getArrayOfRandomLots() {
		return Array.from(new Array(lotsToAdd), () => {
			const randomWord = generateRandomWord(getRandomInRange(5, 100));

			return {
				title: randomWord,
				value: getRandomInRange(5, 200)
			};
		});
	}

	function addLots() {
		for (const { title, value } of getArrayOfRandomLots()) {
			lots.add(title, value);
		}
	}
</script>

<div style="position: absolute; right: 15px; bottom: 15px;">
	<Button icon={settingsIcon} color="transparent" on:click={() => (isShown = !isShown)} />
	{#if isShown}
		<div class="test-kit" transition:fly={{ x: 200 }}>
			<div style="display: flex; flex-direction: column; width: 100%;">
				<div style="display: flex;">
					<div style="display: flex; align-items: center; gap: 10px;">
						<div>Ник</div>
						<Input
							--input-w-w="100%"
							id="lot-text-{888}"
							type="text"
							isBorderless={true}
							bind:value={username}
						/>
					</div>
					<div style="display: flex; align-items: center; gap: 10px;">
						<div>Сумма</div>
						<NumberInput
							--input-w-w="100%"
							--input-w="100%"
							id="lot-value-{999}"
							isBorderless={true}
							bind:value={amount}
						/>
					</div>
				</div>
				<div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
					<div>Текст</div>
					<Textarea --textarea-font-size="16px" bind:value={message} id="lot-text{999}" />
				</div>
				<div style="display: grid; grid-template-columns: 1fr 1fr; margin-top: 5px; gap: 5px;">
					<TextButton text="Донат" on:click={donate} />
					<TextButton text="Вклин" on:click={fireExtendSpinEvent} />
					<TextButton text="Стоп Колесо" on:click={fireStopSpinEvent} />
					<TextButton text="Случайные варианты" on:click={donateRandom} />
				</div>
			</div>
			<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
				<div style="display: flex; align-items: center; gap: 10px;">
					<div style="text-wrap: nowrap;">Количество лотов</div>
					<NumberInput
						--input-w-w="100%"
						--input-w="100%"
						id="lot-value{1001}"
						isBorderless={true}
						bind:value={lotsToAdd}
					/>
				</div>
				<TextButton text="Добавить лоты" on:click={addLots} />
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.test-kit {
		position: absolute;
		top: -340px;
		left: -340px;
		z-index: 999;
		display: flex;
		gap: 5px;
		flex-direction: column;
		align-items: end;
		padding: 16px;
		background-color: var(--surface-container);
	}
</style>
