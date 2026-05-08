import { DONATEX_TOKEN_COOKIE } from '$env/static/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get(DONATEX_TOKEN_COOKIE);
	if (!token) return json({ error: 'Unauthorized' }, { status: 401 });

	return json({ token });
};