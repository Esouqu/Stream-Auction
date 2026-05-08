import { toast } from 'svelte-sonner';
import { SOCKET_STATE, type ISocketConnectionData } from '../interfaces';
import donationAlertsApi from '$lib/api/donationalertsApi.svelte';
import DonationSocket from './DonationSocket.svelte';

interface DonationAlertsDonationMessage {
	id: number;
	name: string;
	username: string;
	amount: number;
	amount_in_user_currency: number;
	currency: string;
	message: string;
	created_at: string;
	message_type: string;
	paying_system: string;
	is_shown: boolean;
	recipient_name: string;
	recipient: string;
	shown_at: string;
	reason: string;
}

class DonationAlertsSocket extends DonationSocket {
	private _socket: WebSocket | undefined;
	private _roomId: string;
	private _socketToken: string | undefined;

	constructor({ roomId, socketToken }: ISocketConnectionData) {
		super('DonationAlerts', 'bg-amber-500');
		this._roomId = `$alerts:donation_${roomId}`;
		this._socketToken = socketToken;
	}

	public async connect() {
		if (!this._socketToken) return;

		this._state = SOCKET_STATE.CONNECTING;
		this._socket = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');

		this._socket.addEventListener('open', () => {
			this._socket?.send(
				JSON.stringify({
					params: { token: this._socketToken },
					id: 1
				})
			);
		});

		this._socket.addEventListener('message', async (event) => {
			const message = JSON.parse(event.data);

			if (message.id === 1) {
				let socketToken: string | undefined;


				try {
					const data = await donationAlertsApi.getSocketToken(this._roomId, message.result.client);

					if (!data) {
						throw new Error('No token received');
					}

					socketToken = data;

				} catch {
					toast.error(
						"Ошибка при подключении к DonationAlerts",
						{ description: "Попробуйте еще раз." }
					);
					this._state = SOCKET_STATE.CLOSED;
					return;
				}

				this._socket?.send(
					JSON.stringify({
						params: {
							channel: this._roomId,
							token: socketToken
						},
						method: 1,
						id: 2
					})
				);

				this._state = SOCKET_STATE.OPEN;
			}

			if (!message.result.type && message.result.channel === this._roomId) {
				const donation: DonationAlertsDonationMessage = message.result.data.data;
				const username = donation.username ?? 'Аноним';
				const amount = Math.round(donation.amount_in_user_currency);

				for (const handler of this._donationListeners) {
					handler({
						username,
						amount,
						message: donation.message,
						source: 'DonationAlerts'
					});
				}
			}
		});

		this._socket.addEventListener('close', () => {
			this._state = SOCKET_STATE.CLOSED;
		});

		this._socket.addEventListener('error', (event) => {
			console.error('WebSocket error:', event);
			this._state = SOCKET_STATE.CLOSED;
		});
	}

	public disconnect() {
		this._socket?.close();
		this._state = SOCKET_STATE.CLOSED;
	}

	get state() { return this._state }

	get isOpen() { return this._state === SOCKET_STATE.OPEN }
	get isConnecting() { return this._state === SOCKET_STATE.CONNECTING }
	get isClosed() { return this._state === SOCKET_STATE.CLOSED }
}

export default DonationAlertsSocket;