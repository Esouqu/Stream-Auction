import { DONATEPAY_KEY_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ fetch, cookies }) => {
  const apiKey = cookies.get(DONATEPAY_KEY_COOKIE);
  const TOKEN_ENDPOINT = 'https://donatepay.ru/api/v2/socket/token';

  if (!apiKey) return new Response('No API key found', { status: 401 });

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_token: apiKey })
    });
    const data = await response.json();
    return new Response(JSON.stringify({ token: data.token, apiKey }), { status: 200 });
  } catch (error) {
    console.error('Error fetching Centrifuge token:', error);
    return new Response('Error fetching Centrifuge token', { status: 500 });
  }
};