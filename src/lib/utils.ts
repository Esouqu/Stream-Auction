import colors from "./colors";
import type { IPieItem } from "./interfaces";

export function polarToCartesian(radius: number, angleInDegrees: number) {
  const radians = (angleInDegrees - 90) * Math.PI / 180;

  return {
    x: radius + (radius * Math.cos(radians)),
    y: radius + (radius * Math.sin(radians)),
  };
}

export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

export function getTotal(values: number[]) {
  return values.reduce((a, b) => a + b, 0);
}

export function compareStrings(str1: string, str2: string) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  // matrix = [0, 1, 2, 3, 4, 5]
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  // matrix = [[0, 1, 2, 3], 1, 2, 3 , 4, 5]
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill in the matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }

  // Calculate the similarity percentage
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Number(similarity.toFixed(0));
}

export function calculateShortTitle(title: string, maxLength: number): string {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
}

export function getPercentFromTotal(value: number, total: number, decimals: number = 1) {
  return ((value / total) * 100).toFixed(decimals);
}

export function createPie(items: IPieItem[], radius: number) {
  const total = getTotal(items.map((item) => item.value));
  const maxTitleLength = Number(((radius / 100) * 5.75).toFixed(2));

  let startAngle: number;
  let endAngle: number;

  return items.map(({ value, title }, idx) => {
    const deg = (value / total) * 360;
    // console.log(deg);

    startAngle = idx && endAngle;
    endAngle = !idx ? deg : startAngle + deg;

    const isCircle = endAngle - startAngle === 360;
    const start = polarToCartesian(radius, startAngle);
    const end = polarToCartesian(radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    const middleAngle = (startAngle + endAngle) / 2;
    const middle = polarToCartesian(radius, middleAngle);
    // const color = colors[3][Math.floor(Math.random() * colors[3].length)];
    const color = colors[3][idx % colors[3].length];

    return {
      shortTitle: calculateShortTitle(title, maxTitleLength),
      title,
      value,
      percent: getPercentFromTotal(value, total),
      color,
      startAngle,
      middleAngle,
      endAngle,
      startPoint: start,
      middlePoint: middle,
      endPoint: end,
      largeArcFlag,
      isCircle
    };
  });
}

export function formatTime(ms: number) {
  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const msRemaining = Math.floor((ms % 1000) / 10);

  return {
    min: String(min).padStart(2, '0'),
    sec: String(sec).padStart(2, '0'),
    ms: String(msRemaining).padStart(2, '0')
  };
}