import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ cookies }) => {
  const session = cookies.get('session');

  // console.log(session)
  if (!session) return;

  return {
    userId: JSON.parse(session).userId,
    socketToken: JSON.parse(session).socketToken,
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