export interface IPieItem {
  id: number;
  title: string;
  value: number;
  color: string;
}

export interface ILot extends IPieItem {
  donators: string[];
}

export interface IAuthTokenData {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface IDonationData {
  id: number;
  username: string;
  amount: number;
  amount_in_user_currency: number;
  currency: string;
  message: string;
  created_at: string;
  mostSimilarLot: ILot | null;
}

export interface IRoute {
  id: number;
  title: string;
  icon: string;
  url: string;
  element: HTMLElement | null;
}

export interface ISetting {
  isToggled: boolean;
  description: string;
  value: string | null;
}