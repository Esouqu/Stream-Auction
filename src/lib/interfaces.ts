export interface IRoute {
  id: number;
  title: string;
  icon: string;
  url: string;
}

export interface ICountdownTimerState {
  isRunning: boolean;
  timeRemaining: number;
}

export interface IPreset {
  title: string;
  text: string;
}

export interface ILot {
  id: number;
  title: string;
  value: number;
  color: string;
  contrastColor: string;
  donators: string[];
}

export interface IPieItem extends ILot {
  percent: string;
  startAngle: number;
  endAngle: number;
  isUrl: boolean;
}

export interface IAuthTokenData {
  token_type: string;
  expires_in: number;
  access_token: string;
  refresh_token: string;
}

export interface IDonationAlertsUserData {
  id: number;
  code: string;
  name: string;
  is_active: number;
  avatar: string;
  email: string | null;
  language: string;
  socket_connection_token: string
}

export interface IDonationDataFull {
  id: number | string;
  type: 'Twitch' | 'Donation Alerts';
  isInstant: boolean;
  username: string;
  amount: number;
  amount_in_user_currency: number;
  currency: string;
  message: string;
  created_at: string;
  mostSimilarLot: ILot | null;
  name: string,
  message_type: string,
  paying_system: string,
  is_shown: boolean,
  recipient_name: string,
  recipient: string,
  shown_at: string,
  reason: string,
}

export interface IDonationData {
  id: number | string;
  type: 'Twitch' | 'Donation Alerts';
  isInstant: boolean;
  username: string;
  amount: number;
  amount_in_user_currency: number;
  currency: string;
  message: string;
  created_at: string;
  mostSimilarLot: ILot | null;
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
  created_at: Date
}

export interface ITwitchRedeemedReward {
  timestamp: Date;
  redemption: {
    id: string;
    user: {
      id: number;
      login: string;
      display_name: string
    };
    channel_id: number;
    redeemed_at: Date;
    reward: {
      id: string;
      channel_id: number;
      title: string;
      prompt: string;
      cost: number;
      is_user_input_required: boolean;
      is_sub_only: boolean;
      image: {
        url_1x: string;
        url_2x: string;
        url_4x: string
      };
      default_image: {
        url_1x: string;
        url_2x: string;
        url_4x: string;
      };
      background_color: string;
      is_enabled: boolean;
      is_paused: boolean;
      is_in_stock: boolean;
      max_per_stream: { is_enabled: boolean; max_per_stream: number };
      should_redemptions_skip_request_queue: boolean
    };
    user_input: string;
    status: 'FULFILLED' | 'UNFULFILLED'
  }
}
