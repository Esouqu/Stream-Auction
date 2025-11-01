import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { browser } from "$app/environment";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function randomFromRange(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getShortenedText(str: string, fontStyle: string, maxWidth: number) {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) return str;

	context.font = fontStyle;

	let truncatedStr = str;
	let width = context.measureText(truncatedStr).width;

	while (width > maxWidth && truncatedStr.length > 0) {
		truncatedStr = truncatedStr.slice(0, -1);
		width = context.measureText(truncatedStr).width;
	}

	return truncatedStr + (truncatedStr !== str ? '...' : '');
}

// function extractPattern(input) {
// 	// Regular expression to match the pattern {number} на {string | number | special with #}
// 	const regex = /(\d+)\s+на\s+([#\wА-Яа-яёЁ]+)/g;
// 	const matches = [];
// 	let match;

// 	while ((match = regex.exec(input)) !== null) {
// 		matches.push({
// 			number: match[1], // The number part
// 			value: match[2]   // The string, number, or special part
// 		});
// 	}

// 	return matches;
// }

export function updateLocalStorageVersion(currentVersion: number) {
	if (!browser) return;

	const storedVersion = localStorage.getItem('version');
	const parsedVersion = parseInt(storedVersion || '0', 10);

	if (parsedVersion !== currentVersion) {
		localStorage.clear();
		localStorage.setItem('version', currentVersion.toString());
	}
}

export function getNoun(num: number, words: string[]) {
	const lastTwoDigits = Math.abs(num) % 100;
	const lastDigit = lastTwoDigits % 10;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return words[2];
	} else if (lastDigit === 1) {
		return words[0];
	} else if (lastDigit >= 2 && lastDigit <= 4) {
		return words[1];
	} else {
		return words[2];
	}
}

export function formatDate(date: Date) {
	const currentYear = new Date().getFullYear();
	const dateYear = date.getFullYear();

	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: dateYear === currentYear ? undefined : 'numeric',
	});
}

export function formatTime(ms: number) {
	// const hours = Math.floor(ms / 3600000);
	const min = Math.floor(ms / 60000);
	const sec = Math.floor((ms % 60000) / 1000);
	const remainingMs = Math.floor((ms % 1000) / 10);

	return {
		// hours: hours,
		minutes: min,
		seconds: sec,
		ms: remainingMs
	}
}

export function formatNumberWithSuffix(number: number): string {
	if (number === 0) return "0";

	const suffixes = ['', ' тыс.', ' млн', ' млрд'];
	const exp = Math.floor(Math.log10(number) / 3);
	const suffix = suffixes[exp];
	const num = number / 10 ** (exp * 3);

	const formattedNumber = num.toFixed(1);
	return (formattedNumber.endsWith('.0') ? num.toFixed(0) : formattedNumber) + suffix;
}

export function getPercentFromTotal(value: number, total: number, decimals: number = 1) {
	const percent = (value / total) * 100;
	return percent >= 100 ? `${percent.toFixed(0)}%` : `${percent.toFixed(decimals)}%`;
}

export function remToPx(rem: number) {
	if (!browser) return 0;
	return rem * parseFloat(getComputedStyle(document.body).fontSize);
}
