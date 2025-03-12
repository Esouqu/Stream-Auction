import {HttpTransportType, HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";
import type {IDonationSocket, IDonationSocketData} from "../interfaces";
import {SOCKET_STATE} from "./DonationAlertsSocket.svelte";
import {PUBLIC_LIVEHUB_SERVER_HOST} from "$env/static/public";

enum LiveHubAlertStatus {
    New = 0,
    Ready = 10,
    Queued = 20,
    Sending = 30,
    Finished = 40,
    Cancelled = 50
}

enum LiveHubCurrencyType {
    TON = 1,
    USD = 10,
    RUB = 20,
    EUR = 30,
    UAH = 40,
    BYN = 50,
    KZT = 60,
}

interface LiveHubSafeText {
    rawText: string | null;
    safeText: string | null;
}

interface LiveHubCurrency {
    symbol: string | null;
    amount: number;
    type: LiveHubCurrencyType;
}

interface LiveHubDonationMessage {
    id: string;
    nickname: LiveHubSafeText | null;
    message: LiveHubSafeText | null;
    donation: LiveHubCurrency;
    status: LiveHubAlertStatus;
    presetId: string | null;
}

export class LiveHubSocket implements IDonationSocket {
    readonly id = 'LiveHub';
    readonly color = 'bg-red-500/50';

    private _state: SOCKET_STATE = $state(SOCKET_STATE.CLOSED);
    private _connection: HubConnection | undefined;

    public onDonation: ((donation: IDonationSocketData) => void) | undefined;

    constructor(token: string) {
        this._connection = new HubConnectionBuilder()
            .withUrl(`${PUBLIC_LIVEHUB_SERVER_HOST}/signalr-hubs/alert`, {
                transport: HttpTransportType.WebSockets,
                withCredentials: true,
                skipNegotiation: true,
                accessTokenFactory: () => {
                    return token || ''
                }
            })
            // .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.setupListeners();
    }

    private setupListeners() {
        if (!this._connection) {
            return;
        }

        this._connection.onclose(() => {
            console.warn("LiveHub Realtime disconnected, trying to reconnect...");
            this._state = SOCKET_STATE.CLOSED;
        });

        this._connection.onreconnected(() => {
            console.log("LiveHub Realtime reconnected!");
            this._state = SOCKET_STATE.OPEN;
        });

        this._connection.on("OnDisplayAlert", (data: LiveHubDonationMessage) => {
            console.log("LiveHub Realtime received donation:", data);
            if (!this.onDonation) {
                return;
            }

            const username = data.nickname?.safeText;
            const message = data.message?.safeText;
            const amount = Math.round(data.donation.amount);
            const currency = Object.keys(LiveHubCurrencyType)[data.donation.type];

            this.onDonation({
                username: username || 'Аноним',
                amount: amount,
                currency: currency,
                message: message || '-',
                source: 'LiveHub'
            });
        });
    }

    public async connect(): Promise<void> {
        if (!this._connection) {
            return;
        }

        if (this._connection.state === HubConnectionState.Connected) {
            return;
        }

        this._state = SOCKET_STATE.CONNECTING;

        try {
            await this._connection.start();
            console.log("Connected to LiveHub Realtime");
            this._state = SOCKET_STATE.OPEN;
        } catch (error) {
            console.error("LiveHub Realtime connection error:", error);
            this._state = SOCKET_STATE.CLOSED;
            // setTimeout(() => this.connect(), 5000);
        }
    }

    public async disconnect(): Promise<void> {
        if (!this._connection) {
            return;
        }

        if (this._connection.state !== HubConnectionState.Connected) {
            return;
        }

        await this._connection.stop();
        this._state = SOCKET_STATE.CLOSED;
        console.log("Disconnected from LiveHub Realtime");
    }

    get state() {
        return this._state;
    }

    get isOpen() {
        return this._state === SOCKET_STATE.OPEN;
    }

    get isConnecting() {
        return this._state === SOCKET_STATE.CONNECTING;
    }

    get isClosed() {
        return this._state === SOCKET_STATE.CLOSED;
    }
}

export default LiveHubSocket
