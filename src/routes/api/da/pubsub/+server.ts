import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

interface ISocketTokenData {
  channels: {
    token: string
  }[]
}

export const POST: RequestHandler = async ({ request, cookies }) => {
  const session = cookies.get('daSession');
  const body = await request.json();

  if (!session) return new Response('No donation alerts session available', { status: 401 });

  const url = 'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
  const data = await axios.post<ISocketTokenData>(url, body, {
    headers: {
      'Authorization': `Bearer ${session}`,
      'Content-Type': 'application/json',
    }
  }).then((res) => res.data.channels[0].token);

  return new Response(JSON.stringify(data), { status: 200 });
};
