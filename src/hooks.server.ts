import { getLastUpdateDate } from "$lib/changelog";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api')) return await resolve(event);

  const lastSeenUpdates = event.cookies.get('lastSeenUpdates');
  const lastSeenWarning = event.cookies.get('lastSeenWarning');
  const wheelWarningDate = new Date('2024-06-30 10:30:03').toISOString();

  if (lastSeenUpdates) {
    const haveSeenUpdates = new Date(lastSeenUpdates) > getLastUpdateDate();

    event.locals.haveSeenUpdates = haveSeenUpdates;

    if (haveSeenUpdates) event.fetch('/api/seen-updates', { method: 'POST' });
  } else {
    event.locals.haveSeenUpdates = false;
  }

  if (lastSeenWarning) {
    const haveSeenWarning = new Date(lastSeenWarning) > new Date(wheelWarningDate);

    console.log('seen warning:', lastSeenWarning, '\nwarning date: ', new Date(wheelWarningDate));
    event.locals.haveSeenWarning = haveSeenWarning;

    if (haveSeenWarning) event.fetch('/api/seen-warning', { method: 'POST' });
  } else {
    event.locals.haveSeenWarning = false;
  }

  return await resolve(event);
};