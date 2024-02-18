<script lang="ts">
	import donations from '$lib/stores/donations';
	import Input from './Input.svelte';
	import NumberInput from './NumberInput.svelte';
	import TextButton from './TextButton.svelte';
	import Textarea from './Textarea.svelte';

	let amount: number = 30;
	let username: string = 'Tester';
	let message: string = 'test';
	// let type: 'Donation Alerts' | 'Twitch' = 'Twitch';
	let type: 'Donation Alerts' | 'Twitch' = 'Donation Alerts';
	let currency: string = 'RUB';
</script>

<div style="display: flex; gap: 5px; flex-direction: column; align-items: center;">
	<div style="display: flex;">
		<Input --input-w="100%" id="lot-text-{888}" type="text" bind:value={username} />
		<NumberInput --input-w="90px" id="lot-value-{999}" suffix="Руб" bind:value={amount} />
	</div>
	<Textarea bind:value={message} id="lot-text{999}" />
	<TextButton
		text="Донат"
		on:click={() =>
			amount &&
			donations.add({
				id: Math.floor(Math.random() * 100000),
				username: username || 'Аноним',
				type,
				message,
				amount: amount,
				amount_in_user_currency: amount,
				currency,
				mostSimilarLot: undefined,
				created_at: Date.now().toString(),
				isInstant: false
			})}
	/>
</div>
