import { LIVEHUB_REFRESH_TOKEN_COOKIE, LIVEHUB_TOKEN_COOKIE } from "$env/static/private";
import { PUBLIC_LIVEHUB_SERVER_HOST} from "$env/static/public";
import type { RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ cookies, fetch }) => {
    const token = cookies.get(LIVEHUB_TOKEN_COOKIE);
    const refreshToken = cookies.get(LIVEHUB_REFRESH_TOKEN_COOKIE);

    if (!token && !refreshToken) {
        return new Response(JSON.stringify('No LiveHub session available'), { status: 404 });
    }

    const response = await fetch(`${PUBLIC_LIVEHUB_SERVER_HOST}/api/app/account/current`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
        return new Response(JSON.stringify('Failed to get user data'),    { status: response.status });
    }

    const { data: userData } = {
        data: await response.json()
    };

    return new Response(JSON.stringify(userData), { status: 200 });
};
