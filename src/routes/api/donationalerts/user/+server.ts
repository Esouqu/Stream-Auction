import type { IDonationAlertsUserData } from "$lib/interfaces";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get('daSession');

  if (!session) return new Response(JSON.stringify('No DonationAlerts session available'), { status: 401 });

  const user = await fetch('https://www.donationalerts.com/api/v1/user/oauth', {
    headers: { 'Authorization': `Bearer ${session}` }
  }).then((res) => res.json()).then((data: { data: IDonationAlertsUserData }) => data.data);

  return new Response(JSON.stringify(user), { status: 200 });
};