import Color from "color";
import pattern1 from "$lib/assets/patterns/pattern1.png";
import pattern3 from "$lib/assets/patterns/pattern3.jpg";
import pattern4 from "$lib/assets/patterns/pattern4.png";
import pattern5 from "$lib/assets/patterns/pattern5.png";

export const degreesToRadians = Math.PI / 180;
export const radiansToDegrees = 180 / Math.PI;
export const colors: Color[] = [
	Color('#fb2c36'), // red
	Color('#ff6900'), // orange
	Color('#fe9a00'), // amber
	Color('#f0b100'), // yellow
	Color('#7ccf00'), // lime
	Color('#00c951'), // green
	Color('#00bc7d'), // emerald
	Color('#00bba7'), // teal
	Color('#00b8db'), // cyan
	Color('#00a6f4'), // sky
	Color('#2b7fff'), // blue
	Color('#615fff'), // indigo
	Color('#8e51ff'), // violet
	Color('#ad46ff'), // purple
	Color('#e12afb'), // fuchsia
	Color('#f6339a'), // pink
	// Color('#f43f5e'),
];

export const patterns = [
	null,
	pattern1,
	pattern3,
	pattern4,
	pattern5,
];
