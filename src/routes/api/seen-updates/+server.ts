import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  const date = new Date().toISOString();

  cookies.set('lastSeenUpdates', date, { path: '/' });

  return new Response('OK', { status: 200 });
};