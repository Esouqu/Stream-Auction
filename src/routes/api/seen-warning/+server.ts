import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { createdAt } = await request.json().then((data: { createdAt: string }) => data);

  cookies.set('lastSeenWarning', createdAt, { path: '/' });

  return new Response('OK', { status: 200 });
};
