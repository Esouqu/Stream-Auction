import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const refreshToken = cookies.get('daRefreshToken');
  let session = cookies.get('daSession');

  if (!session && !refreshToken) return new Response(JSON.stringify(null), { status: 401 });

  if (!session) {
    session = await fetch('/api/da/refresh', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => data.access_token);
  }

  return new Response(JSON.stringify(session), { status: 200 });
};