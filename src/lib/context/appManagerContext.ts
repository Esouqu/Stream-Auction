import type { AppManager } from '$lib/stores/AppManager.svelte';
import { getContext, setContext } from 'svelte';

const appKey = Symbol('app');

export function setAppManagerContext(value: AppManager) {
  setContext(appKey, value);
}

export function getAppManagerContext(): AppManager {
  return getContext(appKey) as AppManager;
}