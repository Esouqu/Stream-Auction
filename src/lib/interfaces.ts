export interface IPoint {
  x: number;
  y: number;
}

export interface ILot {
  id: number;
  title: string;
  value: number;
  color: string;
  donators: string[];
}

export interface IPieItem extends ILot {
  shortTitle: string;
  percent: string;
  startAngle: number;
  middleAngle: number;
  endAngle: number;
  startPoint: IPoint;
  middlePoint: IPoint;
  endPoint: IPoint;
  largeArcFlag: number;
  isCircle: boolean;
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

export type eventTypes = 'add' | 'time' | null;