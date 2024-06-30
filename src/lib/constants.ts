import type { IRoute } from "./interfaces";
import pieIcon from '$lib/assets/pie_chart_icon.svg';
import listIcon from '$lib/assets/list_icon.svg';
import settingsIcon from '$lib/assets/settings_icon.svg';

export enum DONATION_EVENT {
  EXTEND = 'extend',
  STOP = 'stop',
}

export enum WHEEL_STATE {
  IDLE = 'idle',
  SPINNING = 'spinning',
  STOPPED = 'stopped',
  DELAYED = 'delayed',
}

export enum ACTION_MANAGER_STATE {
  IDLE = 'idle',
  AUCTIONING = 'auctioning',
  SPINNING_WHEEL = 'spinning wheel',
  DELAYING_SPIN_STOP = 'delaying spin stop',
}

export enum TIMER_STATE {
  IDLE = 'idle',
  PAUSED = 'paused',
  RUNNING = 'running',
  STOPPED = 'stopped',
  INCREASING = 'increasing',
  DECREASING = 'decreasing'
}

export enum CENTRIFUGE_STATE {
  DISCONNECTED = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  CLOSED = 3,
}

export enum SOCKET_STATE {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export enum NAVIGATION_ROUTES {
  LOTS = '/',
  WHEEL = '/wheel',
  SETTINGS = '/settings',
}

export const routes: IRoute[] = [
  { id: 0, title: 'Аукцион', icon: listIcon, url: NAVIGATION_ROUTES.LOTS },
  { id: 1, title: 'Колесо', icon: pieIcon, url: NAVIGATION_ROUTES.WHEEL },
  { id: 2, title: 'Настройки', icon: settingsIcon, url: NAVIGATION_ROUTES.SETTINGS },
];

export const radiansToDegrees = 180 / Math.PI;
export const degreesToRadians = Math.PI / 180;

export const colors = [
  '#f44336',
  '#e91e63',
  '#9c27b0',
  '#673ab7',
  '#3f51b5',
  '#2196f3',
  '#03a9f4',
  '#00bcd4',
  '#009688',
  '#4caf50',
  '#8bc34a',
  '#cddc39',
  '#ffeb3b',
  '#ffc107',
  '#ff9800',
  '#ff5722',
];
