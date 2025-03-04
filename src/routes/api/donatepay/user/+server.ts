import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const accessToken = url.searchParams.get('access_token');

  if (!accessToken) {
    return new Response(JSON.stringify('No DonatePay session available'), { status: 401 });
  }

  const response = await fetch(`https://donatepay.ru/api/v1/user?access_token=${accessToken}`);

  if (!response.ok) {
    return new Response(JSON.stringify('Failed to fetch user data'), { status: response.status });
  }

  const userData = await response.json();

  return new Response(JSON.stringify(userData), { status: 200 });
};
