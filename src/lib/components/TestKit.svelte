<script lang="ts">
	import actionManager from '$lib/stores/actionManager';
	import lots from '$lib/stores/lots';
	import { getRandomInRange } from '$lib/utils';
	import Input from './Input.svelte';
	import NumberInput from './NumberInput.svelte';
	import TextButton from './TextButton.svelte';
	import Textarea from './Textarea.svelte';

	let amount = 30;
	let username = 'Tester';
	let message = 'test';
	let type: 'Donation Alerts' | 'Twitch' = 'Donation Alerts';
	let currency = 'RUB';
	let amountOfLotsToAdd = 10;

	function addDonation() {
		if (!amount) return;

		actionManager.processDonation({
			id: Math.floor(Math.random() * 100000),
			username: username || 'Аноним',
			type,
			message,
			amount: amount,
			amount_in_user_currency: amount,
			currency,
			created_at: Date.now().toString()
		});
	}

	function addLots() {
		for (const { title, value } of getLotsArray()) {
			lots.add(title, value);
		}
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

	function getLotsArray() {
		return Array.from(new Array(amountOfLotsToAdd), () => {
			const randomWord = generateRandomWord(getRandomInRange(5, 100));

			return {
				title: randomWord,
				value: Math.floor(Math.random() * 100)
			};
		});
	}
</script>

<div style="display: flex; gap: 5px; flex-direction: column; align-items: end;">
	<div style="display: flex; flex-direction: column; width: 100%;">
		<div style="display: flex; align-items: center; gap: 10px;">
			<div>Никнейм</div>
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
		<div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
			<div>Текст</div>
			<Textarea --textarea-font-size="16px" bind:value={message} id="lot-text{999}" />
		</div>
		<TextButton text="Донат" on:click={addDonation} />
	</div>
	<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
		<div style="display: flex; align-items: center; gap: 10px;">
			<div style="text-wrap: nowrap;">Количество лотов</div>
			<NumberInput
				--input-w-w="100%"
				--input-w="100%"
				id="lot-value{1001}"
				isBorderless={true}
				bind:value={amountOfLotsToAdd}
			/>
		</div>
		<TextButton text="Добавить лоты" on:click={addLots} />
	</div>
</div>
