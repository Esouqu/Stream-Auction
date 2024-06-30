import { changelog } from "$lib/changelog";
import type { Handle } from "@sveltejs/kit";

const WARNING_DATE = new Date('2024-06-30 14:49:08');

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api')) return await resolve(event);

  const lastSeenUpdates = event.cookies.get('lastSeenUpdates');
  const lastSeenWarning = event.cookies.get('lastSeenWarning');

  if (lastSeenUpdates) {
    const haveSeenUpdates = new Date(lastSeenUpdates) > changelog[0].createdAt;

    event.locals.haveSeenUpdates = haveSeenUpdates;

    if (haveSeenUpdates) event.fetch('/api/seen-updates', { method: 'POST' });
  } else {
    event.locals.haveSeenUpdates = false;
  }

  if (lastSeenWarning) {
    const haveSeenWarning = new Date(lastSeenWarning) > WARNING_DATE;

    console.log('seen warning:', lastSeenWarning, '\nsenn warning UTC:', new Date(lastSeenWarning).toUTCString(), '\nsenn warning Locale:', new Date(lastSeenWarning).toLocaleString(), '\nwarning date: ', WARNING_DATE);
    event.locals.haveSeenWarning = haveSeenWarning;

    if (haveSeenWarning) event.fetch('/api/seen-warning', { method: 'POST' });
  } else {
    event.locals.haveSeenWarning = false;
  }

  return await resolve(event);
};