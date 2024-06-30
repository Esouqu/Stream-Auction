import { getLastUpdateDate } from "$lib/changelog";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  if (event.url.pathname.startsWith('/api')) return await resolve(event);

  const lastSeenUpdates = event.cookies.get('lastSeenUpdates');
  const lastSeenWarning = event.cookies.get('lastSeenWarning');
  const wheelWarningDate = new Date('2024-06-30 10:30:03').toUTCString();

  if (lastSeenUpdates) {
    const haveSeenUpdates = new Date(lastSeenUpdates) > new Date(getLastUpdateDate());

    console.log('last seen updates: ', new Date(lastSeenUpdates), 'last updates: ', new Date(getLastUpdateDate()))
    event.locals.haveSeenUpdates = haveSeenUpdates;

    if (haveSeenUpdates) event.fetch('/api/seen-updates', {
      method: 'POST',
      body: JSON.stringify({ createdAt: new Date().toUTCString() })
    });
  } else {
    event.locals.haveSeenUpdates = false;
  }

  if (lastSeenWarning) {
    const haveSeenWarning = new Date(lastSeenWarning) > new Date(wheelWarningDate);

    console.log('last seen warning: ', new Date(lastSeenWarning), 'last warning: ', new Date(getLastUpdateDate()))
    event.locals.haveSeenWarning = haveSeenWarning;

    if (haveSeenWarning) event.fetch('/api/seen-warning', {
      method: 'POST',
      body: JSON.stringify({ createdAt: new Date().toUTCString() })
    });
  } else {
    event.locals.haveSeenWarning = false;
  }

  return await resolve(event);
};