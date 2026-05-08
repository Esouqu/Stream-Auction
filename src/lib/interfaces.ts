export type DonationSource = 'DonationAlerts' | 'DonatePay' | 'DonateX';
export type FlyDirection = 1 | -1;

export enum SOCKET_STATE {
	OPEN,
	CLOSED,
	CONNECTING,
}

export interface ISocketConnectionData {
	roomId: number;
	socketToken?: string;
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

export interface IDonateXDonationData {
	id: string;
	username: string;
	message: string;
	currency: string;
	amount: number;
	amountInRub: number;
	timestamp: string;
	isTest: boolean;
	isPotentiallyUnsafe: boolean;
	isFeePaidByUser: boolean;
	voiceFilePath: "https://cdn.donatex.gg/donation-voices/voice.mp3";
}