import { DONATIONALERTS_REFRESH_TOKEN_COOKIE, DONATIONALERTS_TOKEN_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete(DONATIONALERTS_TOKEN_COOKIE, { path: '/' });
  cookies.delete(DONATIONALERTS_REFRESH_TOKEN_COOKIE, { path: '/' });

  return new Response('OK', { status: 200 });
};