import Color from "color";

export const degreesToRadians = Math.PI / 180;
export const radiansToDegrees = 180 / Math.PI;
export const colors: Color[] = [
  Color('#ef4444'), // red
  Color('#f97316'), // orange
  Color('#f59e0b'), // amber
  Color('#eab308'), // yellow
  Color('#84cc16'), // lime
  Color('#22c55e'), // green
  Color('#10b981'), // emerald
  Color('#14b8a6'), // teal
  Color('#06b6d4'), // cyan
  Color('#0ea5e9'), // sky
  Color('#3b82f6'), // blue
  Color('#6366f1'), // indigo
  Color('#8b5cf6'), // violet
  Color('#a855f7'), // purple
  Color('#d946ef'), // fuchsia
  Color('#ec4899'), // pink
  // Color('#f43f5e'),
];

export const themes = [
  { theme: 'theme-white', color: Color('white') },
  { theme: 'theme-red', color: colors[0] },
  { theme: 'theme-orange', color: colors[1] },
  { theme: 'theme-yellow', color: colors[3] },
  { theme: 'theme-lime', color: colors[4] },
  { theme: 'theme-green', color: colors[5] },
  { theme: 'theme-emerald', color: colors[6] },
  { theme: 'theme-teal', color: colors[7] },
  { theme: 'theme-cyan', color: colors[8] },
  { theme: 'theme-sky', color: colors[9] },
  { theme: 'theme-blue', color: colors[10] },
  { theme: 'theme-indigo', color: colors[11] },
  { theme: 'theme-violet', color: colors[12] },
  { theme: 'theme-purple', color: colors[13] },
  { theme: 'theme-fuchsia', color: colors[14] },
  { theme: 'theme-pink', color: colors[15] },
];

export const patterns = [
  null,
  'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/patterns/pattern4-1ebz6SrCw4YRKgnnBJlXeH8otyvYj4.png',
  'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/patterns/pattern2-bfr6Ttl1bIbY5kw1HPQBIQHOU9Mrk9.png',
  'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/patterns/pattern3-Q16PlIdpKAdJsblTsmHV1PNvPBz8YP.jpg',
  // 'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/patterns/pattern1-sapVQisWvjlVCqek9okbLPEM4oNtU3.png',
  'https://vl7xhhuughjqjft6.public.blob.vercel-storage.com/patterns/pattern5-uXZwvagY0f8JbfVStCN3Nhkw3mjON8.png',
];
