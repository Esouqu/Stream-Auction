import type { IRoute } from "./interfaces";
import pieIcon from '$lib/assets/pie_chart_icon.svg';
import listIcon from '$lib/assets/list_icon.svg';
import settingsIcon from '$lib/assets/settings_icon.svg';

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
  DELAYING_WHEEL_WINNER = 'delaying wheel winner',
}

export enum TIMER_STATE {
  IDLE = 'idle',
  PAUSED = 'paused',
  RUNNING = 'running',
}

export enum NAVIGATION_ROUTES {
  LOTS = '/',
  WHEEL = '/wheel',
  SETTINGS = '/settings',
}

export const routes: IRoute[] = [
  { id: 0, title: 'Лоты', icon: listIcon, url: NAVIGATION_ROUTES.LOTS },
  { id: 1, title: 'Колесо', icon: pieIcon, url: NAVIGATION_ROUTES.WHEEL },
  { id: 2, title: 'Настройки', icon: settingsIcon, url: NAVIGATION_ROUTES.SETTINGS }
  // { id: 2, title: 'Бомбер', icon: getIcon('bomb'), url: '/bomber' },
  // { id: 2, title: 'События', icon: eventIcon, url: '/events' },
];

export const radiansToDegrees = 180 / Math.PI;
export const degreesToRadians = Math.PI / 180;
