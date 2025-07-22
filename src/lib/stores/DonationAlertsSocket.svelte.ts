import { SOCKET_STATE, type IDonationSocket, type IDonationSocketData, type ISocketConnectionData } from '../interfaces';

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

class DonationAlertsSocket implements IDonationSocket {
  readonly id = 'DonationAlerts';
  readonly color = 'bg-orange-500/50';
  private _state: SOCKET_STATE = $state(SOCKET_STATE.CLOSED);
  private _socket: WebSocket | undefined;
  private _roomId: string;
  private _socketToken: string | undefined;
  public onDonation: ((donation: IDonationSocketData) => void) | undefined;

  constructor({ id, socketToken }: ISocketConnectionData) {
    this._roomId = `$alerts:donation_${id}`;
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
        const socketToken = await fetch('/api/donationalerts/centrifuge', {
          method: 'POST',
          body: JSON.stringify({
            channels: [this._roomId],
            client: message.result.client
          })
        }).then((res) => res.json()).then((data: string) => data);

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
        const roundedAmount = Math.round(donation.amount_in_user_currency);

        this.onDonation?.({
          username,
          amount: roundedAmount,
          currency: 'RUB',
          message: donation.message,
          source: 'DonationAlerts'
        });
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