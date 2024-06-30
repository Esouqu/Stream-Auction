import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  const date = JSON.stringify(new Date());

  cookies.set('lastSeenUpdates', date, { path: '/' });

  return new Response('OK', { status: 200 });
};