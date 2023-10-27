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
  // await axios.post('https://api.random.org/json-rpc/4/invoke', {
  //   "jsonrpc": "4.0",
  //   "method": "generateSignedIntegers",
  //   "params": {
  //     "apiKey": "12b48f1f-6363-4d82-9be6-ba6e86553a4f",
  //     "n": 1,
  //     "min": 1,
  //     "max": 10,
  //   },
  //   id: 1,
  // }).then((res) => console.log(res.data.result))
};