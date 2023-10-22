import type { RequestHandler } from "@sveltejs/kit";
import axios from "axios";

interface ISocketTokenData {
  channels: {
    token: string
  }[]
}

export const POST: RequestHandler = async ({ request, fetch }) => {
  const session = await fetch('/api/da/session').then((res) => res.json()).then((data) => data);
  const body = await request.json();

  const url = 'https://www.donationalerts.com/api/v1/centrifuge/subscribe';
  const data = await axios.post<ISocketTokenData>(url, body, {
    headers: {
      'Authorization': `Bearer ${session}`,
      'Content-Type': 'application/json',
    }
  }).then((res) => res.data.channels[0].token);

  return new Response(JSON.stringify(data), { status: 200 });
};
