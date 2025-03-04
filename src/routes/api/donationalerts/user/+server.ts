import { DONATIONALERTS_TOKEN_COOKIE } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies, fetch }) => {
  const token = cookies.get(DONATIONALERTS_TOKEN_COOKIE);

  if (!token) {
    return new Response(JSON.stringify('No DonationAlerts session available'), { status: 401 });
  }

  const response = await fetch('https://www.donationalerts.com/api/v1/user/oauth', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return new Response(JSON.stringify('Failed to get user data'), { status: response.status });
  }

  const { data: userData } = await response.json();

  return new Response(JSON.stringify(userData), { status: 200 });
};
