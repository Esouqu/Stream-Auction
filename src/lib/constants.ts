import type { IRoute } from "./interfaces";
import pieIcon from '$lib/assets/pie_chart_icon.svg';
import listIcon from '$lib/assets/list_icon.svg';
import settingsIcon from '$lib/assets/settings_icon.svg';

export enum WHEEL_STATE {
  WAITING,
  SPINNING,
  WINNING,
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
