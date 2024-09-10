import { getRandomInt } from './math';

export function getContrastingColor(hex: string) {
  // Convert hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function getRandomColorHex(): string {
  // Generate a random number between 0 and 255 for red, green, and blue
  const randomColor = Math.floor(Math.random() * 16777215);

  // Convert the number to a hexadecimal string and ensure it's 6 characters long
  const hexColor = `#${randomColor.toString(16).padStart(6, '0')}`;

  return hexColor;
}

export function getRandomLightColorHex(): string {
  // Generate random RGB values, ensuring they are high enough for a light color
  const r = getRandomInt(150, 255); // 200-255
  const g = getRandomInt(150, 255); // 200-255
  const b = getRandomInt(150, 255); // 200-255

  // Convert RGB to hex
  const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)}`;

  return hexColor;
}
