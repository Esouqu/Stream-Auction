import { dev } from "$app/environment";
import { DONATEX_VERIFIER_COOKIE } from "$env/static/private";
import { PUBLIC_DONATEX_CLIENT_ID } from "$env/static/public";
import { redirect, type RequestHandler } from "@sveltejs/kit";

const toBase64Url = (buffer: ArrayBuffer) =>
	btoa(String.fromCharCode(...new Uint8Array(buffer)))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');

async function generatePKCE() {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	const verifier = toBase64Url(array.buffer);

	const encoder = new TextEncoder();
	const data = encoder.encode(verifier);
	const digest = await crypto.subtle.digest('SHA-256', data);

	const challenge = toBase64Url(digest);

	return { verifier, challenge };
};

export const GET: RequestHandler = async ({ cookies, url }) => {
	const SCOPES = ['donations.subscribe', 'offline_access'];
	const { verifier, challenge } = await generatePKCE();

	cookies.set(DONATEX_VERIFIER_COOKIE, verifier, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		maxAge: 60 * 10 // 10 minutes
	});

	const redirectUri = `${url.origin}/api/auth/callback/donatex`;

	const authUrl = new URL('https://donatex.gg/api/connect/authorize');
	authUrl.searchParams.set('client_id', PUBLIC_DONATEX_CLIENT_ID);
	authUrl.searchParams.set('redirect_uri', redirectUri);
	authUrl.searchParams.set('response_type', 'code');
	authUrl.searchParams.set('scope', SCOPES.join(' '));
	authUrl.searchParams.set('code_challenge', challenge);
	authUrl.searchParams.set('code_challenge_method', 'S256');

	throw redirect(302, authUrl.toString());
};
