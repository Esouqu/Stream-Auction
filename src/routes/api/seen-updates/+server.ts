import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.set('lastSeenUpdates', new Date().toString(), { path: '/' });

  return new Response('OK', { status: 200 });
};