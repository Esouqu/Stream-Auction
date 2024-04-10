import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
  cookies.delete('daSession', { path: '/' });
  cookies.delete('daRefreshToken', { path: '/' });

  return new Response('OK', { status: 200 });
};