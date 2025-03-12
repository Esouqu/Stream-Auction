import type {SOCKET_STATE} from "$lib/stores/DonationAlertsSocket.svelte";

export type DonationSource = 'DonationAlerts' | 'DonatePay' | 'LiveHub';

export interface ISocketConnectionData {
    id: number;
    socketToken?: string;
}

export interface IDonationSocket {
    id: DonationSource;
    color: string;
    state: SOCKET_STATE;
    isOpen: boolean;
    isConnecting: boolean;
    isClosed: boolean;
    socket?: WebSocket;
    onDonation?: ((donation: IDonationSocketData) => void);
    connect: () => void;
    disconnect: () => void;
}

export interface ILot {
    id: number;
    title: string;
    value: number;
    color: {
        r: number;
        g: number;
        b: number;
    };
    isDarkColor: boolean;
    donators: string[];
}

export interface IDonationSocketData {
    username: string;
    amount: number;
    currency: string;
    message: string;
    source: DonationSource;
}

export interface IAuthTokenData {
    token_type: string;
    expires_in: number;
    access_token: string;
    refresh_token: string;
}

export interface ITwitchValidation {
    client_id: string;
    login: string;
    scopes: string[];
    user_id: number;
    expires_in: number;
    status?: number;
    message?: string;
}

export interface IDonatePayUserData {
    id: number;
    name: string;
    avatar: string;
    balance: number;
    cashout_sum: number;
}

export interface IDonationAlertsUserData {
    id: number;
    code: string;
    name: string;
    is_active: number;
    avatar: string;
    email: string | null;
    language: string;
    socket_connection_token: string;
}

export interface ITwitchUserData {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email: string;
    created_at: Date;
}

export interface ILiveHubUserData {
    id: string;
    nest_id: string;
    display_name: string;
    icon_url: string;
    is_muted: boolean;
}
