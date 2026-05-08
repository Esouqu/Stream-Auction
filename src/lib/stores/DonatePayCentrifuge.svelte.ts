import Centrifuge from "centrifuge";
import { SOCKET_STATE, type ISocketConnectionData } from "$lib/interfaces";
import donatePayApi from "$lib/api/donatePayApi.svelte";
import { toast } from "svelte-sonner";
import DonationSocket from "./DonationSocket.svelte";

interface DonatePayDonationMessage {
	data: {
		notification: {
			id: number;
			user_id: number;
			type: 'donation';
			view: null;
			vars: {
				name: string;
				comment: string;
				sum: number;
				currency: string;
			};
			created_at: string;
		};
	};
}

class DonatePayCentrifuge extends DonationSocket {
	private _CENTRIFUGO_URL = 'wss://centrifugo.donatepay.ru:443/connection/websocket';
	private _TOKEN_ENDPOINT = 'https://donatepay.ru/api/v2/socket/token';
	private _centrifuge?: Centrifuge;
	private _roomId: string;

	constructor({ roomId }: ISocketConnectionData) {
		super('DonatePay', 'bg-green-500');
		this._roomId = `$public:${roomId}`;
	}

	public disconnect() {
		if (this._centrifuge) this._centrifuge.disconnect();
	}

	public async connect() {
		try {
			this._state = SOCKET_STATE.CONNECTING;

			const data = await donatePayApi.getToken();

			if (!data.apiKey || !data.token)
				throw new Error('Не удалось установить соединение.\nПопробуйте обновить DonatePay API ключ.');

			this._centrifuge = new Centrifuge(this._CENTRIFUGO_URL, {
				subscribeEndpoint: this._TOKEN_ENDPOINT,
				subscribeParams: { access_token: data.apiKey },
				refreshEndpoint: this._TOKEN_ENDPOINT,
				refreshParams: { access_token: data.apiKey },
				disableWithCredentials: true,
			});

			this._centrifuge.setToken(data.token);

			this._centrifuge.subscribe(this._roomId, (message) => {
				const { data } = message as DonatePayDonationMessage;
				const username = data.notification.vars.name ?? 'Аноним';
				const amount = Math.round(data.notification.vars.sum);

				for (const handler of this._donationListeners) {
					handler({
						username,
						amount,
						message: data.notification.vars.comment,
						source: 'DonatePay'
					});
				}
			});

			this._centrifuge.on('connect', () => {
				this._state = SOCKET_STATE.OPEN;
			});

			this._centrifuge.on('disconnect', () => {
				this._state = SOCKET_STATE.CLOSED;
			});

			this._centrifuge.on('error', (error) => {
				console.error('Centrifuge error:', error);
			});

			this._centrifuge.connect();
		} catch (error) {
			const err = error as { message: string };

			this._state = SOCKET_STATE.CLOSED;
			toast.error(err.message);
		}
	};
}

export default DonatePayCentrifuge;
