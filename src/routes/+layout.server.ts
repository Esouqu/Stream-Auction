import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ fetch, cookies }) => {
  await fetch('/api/twitch/validate').then((res) => res.status === 200);
  const daSession = await fetch('/api/da/session')
    .then((res) => res.json())
    .then((data) => data);
  const twitchSession = await fetch('/api/twitch/session')
    .then((res) => res.json())
    .then((data) => data);

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