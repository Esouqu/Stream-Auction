import { dev } from "$app/environment";
import { DONATEPAY_KEY_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
  const token = cookies.get(DONATEPAY_KEY_COOKIE);

  if (!token) return new Response('No API key found', { status: 401 });
  return new Response(JSON.stringify(token), { status: 200 });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
  const body = await request.json();

  cookies.set(DONATEPAY_KEY_COOKIE, body.access_token, {
    path: '/',
    secure: !dev,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // year
  });

  return new Response('OK', { status: 200 });
};

export const DELETE: RequestHandler = async ({ cookies }) => {
  cookies.delete(DONATEPAY_KEY_COOKIE, { path: '/' });

  return new Response('OK', { status: 200 });
};
