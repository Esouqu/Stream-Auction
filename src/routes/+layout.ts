import { dev } from '$app/environment';
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

if (!dev) injectSpeedInsights();