import { dev } from "$app/environment";
import { DONATEX_REFRESH_TOKEN_COOKIE, DONATEX_SECRET_KEY, DONATEX_TOKEN_COOKIE, DONATEX_VERIFIER_COOKIE } from "$env/static/private";
import { PUBLIC_DONATEX_CLIENT_ID } from "$env/static/public";
import type { IAuthTokenData } from "$lib/interfaces";
import { redirect, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code');
	const codeVerifier = cookies.get(DONATEX_VERIFIER_COOKIE);

	if (!code || !codeVerifier) {
		throw redirect(302, '/');
	}

	const tokenUrl = 'https://donatex.gg/api/connect/token';
	const redirectUri = `${url.origin}/api/auth/callback/donatex`;

	const response = await fetch(tokenUrl, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
			client_id: PUBLIC_DONATEX_CLIENT_ID,
			client_secret: DONATEX_SECRET_KEY,
			code_verifier: codeVerifier
		})
	});

	if (!response.ok) {
		const error = await response.text();
		console.error('DonateX Token Error:', error);
		throw redirect(302, '/');
	}

	const tokenData: IAuthTokenData = await response.json();

	cookies.delete(DONATEX_VERIFIER_COOKIE, { path: '/' });

	cookies.set(DONATEX_TOKEN_COOKIE, tokenData.access_token, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: tokenData.expires_in
	});

	if (tokenData.refresh_token) {
		cookies.set(DONATEX_REFRESH_TOKEN_COOKIE, tokenData.refresh_token, {
			path: '/',
			httpOnly: true,
			secure: !dev,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 30
		});
	}

	throw redirect(302, '/');
};