import { dev } from "$app/environment";
import { LIVEHUB_REFRESH_TOKEN_COOKIE, LIVEHUB_TOKEN_COOKIE, LIVEHUB_SECRET_KEY } from "$env/static/private";
import { PUBLIC_LIVEHUB_CLIENT_ID, PUBLIC_LIVEHUB_SERVER_HOST} from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, fetch }) => {
    const refreshToken = cookies.get(LIVEHUB_REFRESH_TOKEN_COOKIE);
    const scope = 'oauth:alert:listen oauth:alert:list offline_access';

    if (!refreshToken) return new Response('No refresh token is available', { status: 400 });

    try {
        const response = await fetch(`${PUBLIC_LIVEHUB_SERVER_HOST}/connect/token`, {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: `${PUBLIC_LIVEHUB_CLIENT_ID}`,
                client_secret: `${LIVEHUB_SECRET_KEY}`,
                refresh_token: refreshToken,
                scope,
            })
        });

        if (response.status === 401) {
            cookies.delete(LIVEHUB_REFRESH_TOKEN_COOKIE, { path: '/' });
            return new Response('The LiveHub refresh token is invalid', { status: 401 });
        }

        const tokenData = await response.json().then((data: IAuthTokenData) => data);

        cookies.set(LIVEHUB_TOKEN_COOKIE, tokenData.access_token, {
            path: '/',
            secure: !dev,
            expires: new Date(Date.now() + tokenData.expires_in)
        });

        if (tokenData.refresh_token) {
            cookies.set(LIVEHUB_REFRESH_TOKEN_COOKIE, tokenData.refresh_token, {
                path: '/',
                secure: !dev,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
            });
        }

        return new Response(JSON.stringify(tokenData), { status: 200 });
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error refreshing LiveHub token:', err);
        } else {
            console.error('Unknown error refreshing LiveHub token:', err);
        }

        return new Response('Something went wrong', { status: 500 });
    }
};
