import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

interface ISocketTokenData {
  channels: {
    token: string
  }[]
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();
  const session = cookies.get('session');

  if (!session) return new Response('Unauthenticated', { status: 400 });

  const url = 'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
  const data = await axios.post<ISocketTokenData>(url, body, {
    headers: {
      'Authorization': `Bearer ${JSON.parse(session).accessToken}`,
      'Content-Type': 'application/json',
    }
  }).then((res) => res.data.channels[0].token);

  return new Response(JSON.stringify(data), { status: 200 });
};
