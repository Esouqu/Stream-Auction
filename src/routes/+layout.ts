import { dev } from '$app/environment';
import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

if (!dev) injectSpeedInsights();