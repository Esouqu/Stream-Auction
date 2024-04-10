import confetti from "canvas-confetti";

export const getRandomColor = (() => {
  let usedColors: string[] = [];

  function getColor(colorArray: string[]) {
    if (usedColors.length === colorArray.length) {
      usedColors = [];
    }

    let randomIndex;
    let randomColor;

    do {
      randomIndex = Math.floor(Math.random() * colorArray.length);
      randomColor = colorArray[randomIndex];
    } while (usedColors.includes(randomColor));

    usedColors.push(randomColor);

    return randomColor;
  }

  return getColor;
})();

export function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

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
  return values.reduce((sum, amount) => sum + amount, 0);
}

export function compareStrings(str1: string, str2: string) {
  const len1 = str1.replace(/\s/g, '').length;
  const len2 = str2.replace(/\s/g, '').length;
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
      const cost = str1[i - 1].toLowerCase() === str2[j - 1].toLowerCase() ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j - 1] + cost, // substitution
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j] + 1 // deletion
      );
    }
  }

  // Calculate the similarity percentage
  const distance = matrix[len1][len2];
  const maxLength = Math.max(len1, len2);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.round(similarity);
}

export function getShortenedText(title: string, maxLength: number): string {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
}

export function getPercentFromTotal(value: number, total: number, decimals: number = 1) {
  return ((value / total) * 100).toFixed(decimals);
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

export function extractUrl(str: string) {
  const urlMatch = str.match(/(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}[^\s]+/g);
  // const urlMatch = str.match(/(https?:\/\/[^\s]+)/);

  if (urlMatch) return urlMatch[0];
}

export function getRandomInRange(min: number | string, max: number | string) {
  const minNum = Number(min);
  const maxNum = Number(max);

  return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
}

export function getGrayscaleColor(color: string) {
  // Remove the "#" symbol from the color string
  color = color.slice(1);

  // Extract the RGB values
  const red = parseInt(color.substring(0, 2), 16);
  const green = parseInt(color.substring(2, 4), 16);
  const blue = parseInt(color.substring(4, 6), 16);

  // Calculate the grayscale value
  const grayscale = 0.299 * red + 0.587 * green + 0.114 * blue;

  // Convert the grayscale value back to hexadecimal
  const grayscaleHex = '#' + Math.round(grayscale).toString(16).repeat(3);

  // Return the grayscale color
  return grayscaleHex;
}

export function modifyBrightness(color: string, brightnessFactor: number) {
  const hex = color.slice(1); // Remove the leading #
  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);

  const modifiedRed = Math.round(red * brightnessFactor);
  const modifiedGreen = Math.round(green * brightnessFactor);
  const modifiedBlue = Math.round(blue * brightnessFactor);

  const modifiedHex = (
    (modifiedRed < 16 ? '0' : '') + modifiedRed.toString(16) +
    (modifiedGreen < 16 ? '0' : '') + modifiedGreen.toString(16) +
    (modifiedBlue < 16 ? '0' : '') + modifiedBlue.toString(16)
  );

  return '#' + modifiedHex;
}

export function getContrastColor(hexColor: string) {
  if (hexColor.startsWith("#")) {
    hexColor = hexColor.slice(1);
  }

  // Convert the hex color code to RGB values
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);

  // Calculate the relative luminance using the formula for sRGB color space
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Determine the appropriate contrast color based on the luminance
  if (luminance > 0.5) {
    return "#000000"; // Return black for lighter backgrounds
  } else {
    return "#ffffff"; // Return white for darker backgrounds
  }
}

export function isVideoOrImage(link: string) {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

  const fileExtension = link.split('.').pop()!.toLowerCase();

  if (videoExtensions.includes(fileExtension)) {
    return "video";
  } else if (imageExtensions.includes(fileExtension)) {
    return "image";
  } else {
    return;
  }
}

export function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.75 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      shapes: ['circle'],
      scalar: 2 / 2
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55
  });
  fire(0.2, {
    spread: 60
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45
  });
}