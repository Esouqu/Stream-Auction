import Centrifuge from "centrifuge";
import { SOCKET_STATE, type IDonationSocket, type IDonationSocketData, type ISocketConnectionData } from "$lib/interfaces";
import donatePayApi from "$lib/api/donatePayApi.svelte";

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

class DonatePayCentrifuge implements IDonationSocket {
  readonly id = 'DonatePay';
  readonly color = 'bg-green-500/50';
  private _state: SOCKET_STATE = $state(SOCKET_STATE.CLOSED);
  private _centrifuge: Centrifuge | undefined;
  private _CENTRIFUGO_URL = 'wss://centrifugo.donatepay.ru:443/connection/websocket';
  private _TOKEN_ENDPOINT = 'https://donatepay.ru/api/v2/socket/token';
  private _roomId: string;

  public onDonation: ((donation: IDonationSocketData) => void) | undefined;

  constructor({ id }: ISocketConnectionData) {
    this._roomId = `$public:${id}`;
  }

  public disconnect() {
    if (this._centrifuge) this._centrifuge.disconnect();
  }

  public async connect() {
    try {
      this._state = SOCKET_STATE.CONNECTING;

      const data = await donatePayApi.getToken();

      if (!data?.apiKey) {
        this._state = SOCKET_STATE.CLOSED;
        return;
      }

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

        this.onDonation?.({
          username,
          amount,
          currency: 'RUB',
          message: data.notification.vars.comment,
          source: 'DonatePay'
        });
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
      this._state = SOCKET_STATE.CLOSED;
      console.error('Error starting Centrifuge:', error);
    }
  };

  get state() { return this._state; }
  get isOpen() { return this._state === SOCKET_STATE.OPEN; }
  get isConnecting() { return this._state === SOCKET_STATE.CONNECTING; }
  get isClosed() { return this._state === SOCKET_STATE.CLOSED; }
}

export default DonatePayCentrifuge;
