import { dev } from "$app/environment";
import { DONATEX_REFRESH_TOKEN_COOKIE, DONATEX_SECRET_KEY, DONATEX_TOKEN_COOKIE } from "$env/static/private";
import { PUBLIC_DONATEX_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, fetch }) => {
	const refreshToken = cookies.get(DONATEX_REFRESH_TOKEN_COOKIE);

	if (!refreshToken) {
		return new Response('No refresh token available', { status: 401 });
	}

	try {
		const response = await fetch('https://donatex.gg/api/connect/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
				client_id: PUBLIC_DONATEX_CLIENT_ID,
				client_secret: DONATEX_SECRET_KEY
			})
		});

		if (!response.ok) {
			cookies.delete(DONATEX_TOKEN_COOKIE, { path: '/' });
			cookies.delete(DONATEX_REFRESH_TOKEN_COOKIE, { path: '/' });
			return new Response('Session expired', { status: 401 });
		}

		const tokenData: IAuthTokenData = await response.json();

		const cookieOptions = {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax' as const
		};

		cookies.set(DONATEX_TOKEN_COOKIE, tokenData.access_token, {
			...cookieOptions,
			maxAge: tokenData.expires_in
		});

		if (tokenData.refresh_token) {
			cookies.set(DONATEX_REFRESH_TOKEN_COOKIE, tokenData.refresh_token, {
				...cookieOptions,
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});
		}

		return json({ success: true });
	} catch (err) {
		console.error('DonateX Refresh Error:', err);
		return new Response('Internal error', { status: 500 });
	}
};