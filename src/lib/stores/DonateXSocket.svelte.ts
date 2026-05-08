import { SOCKET_STATE, type IDonateXDonationData } from "$lib/interfaces";
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from "svelte-sonner";
import DonationSocket from "./DonationSocket.svelte";
import donatexApi from "$lib/api/donatexApi.svelte";

class DonateXSocket extends DonationSocket {
	private _socket?: HubConnection;

	constructor() {
		super('DonateX', 'bg-purple-500');
	}

	public disconnect() {
		if (this._socket) this._socket.stop();
	}

	public async connect() {
		try {
			this._state = SOCKET_STATE.CONNECTING;

			const token = await donatexApi.getToken();

			if (!token)
				throw new Error('Не удалось установить соединение.\nПопробуйте обновить DonatePay API ключ.');

			this._socket = new HubConnectionBuilder()
				.withUrl(`https://donatex.gg/api/public-donations-hub?access_token=${token}`)
				.withAutomaticReconnect()
				.configureLogging(LogLevel.Information)
				.build();

			this._socket.on('DonationCreated', (message) => {
				const data = message as IDonateXDonationData;
				const username = data.username ?? 'Аноним';
				const amount = Math.round(data.amountInRub);

				for (const handler of this._donationListeners) {
					handler({
						username,
						amount,
						message: data.message,
						source: 'DonateX'
					});
				}
			});

			await this._socket.start();

			this._state = SOCKET_STATE.OPEN;

			this._socket.onclose(() => {
				this._state = SOCKET_STATE.CLOSED;
			});

			this._socket.onreconnecting(() => {
				toast.warning('Переподключение к DonateX');
			});
		} catch {
			this._state = SOCKET_STATE.CLOSED;
			toast.error('Не удалось установить соединение с DonateX');
		}
	};
}

export default DonateXSocket;