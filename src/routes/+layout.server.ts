import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
  let daSession = cookies.get('daSession');
  let twitchSession = cookies.get('twitchSession');

  await fetch('/api/twitch/validate').then((res) => res.status === 200);

  if (!daSession) {
    const response = await fetch('/api/da/refresh', { method: 'POST' });

    if (response.status === 200) {
      daSession = await response.json().then((data) => data.access_token);
    }
    if (response.status === 401) {
      cookies.delete('daRefreshToken');
    }
  }

  if (!twitchSession) {
    const response = await fetch('api/twitch/refresh', { method: 'POST' });

    if (response.status === 200) {
      twitchSession = await response.json().then((data) => data.access_token);
    }
    if (response.status === 401) {
      cookies.delete('twitchRefreshToken');
    }
  }

  return {
    daSession,
    twitchSession
  }
};