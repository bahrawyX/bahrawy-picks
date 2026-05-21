/**
 * Reads CSS variables and returns resolved color values suitable for Lottie
 * colorFilter injection (floats in [0, 1] per channel).
 */

export type RGBA = [number, number, number, number];

export interface LottieColorPalette {
  primary: RGBA;
  primaryMuted: RGBA;
  foreground: RGBA;
  mutedForeground: RGBA;
  background: RGBA;
  card: RGBA;
  border: RGBA;
}

function hslStringToRgb01(hslString: string): [number, number, number] {
  const parts = hslString.trim().split(/\s+/);
  const h = parseFloat(parts[0]);
  const s = parseFloat(parts[1]) / 100;
  const l = parseFloat(parts[2]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  return [r + m, g + m, b + m];
}

function getCSSVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function getLottieColorPalette(): LottieColorPalette {
  const primary = hslStringToRgb01(getCSSVar('--primary'));
  const foreground = hslStringToRgb01(getCSSVar('--foreground'));
  const mutedFg = hslStringToRgb01(getCSSVar('--muted-foreground'));
  const background = hslStringToRgb01(getCSSVar('--background'));
  const card = hslStringToRgb01(getCSSVar('--card'));
  const border = hslStringToRgb01(getCSSVar('--border'));

  return {
    primary: [...primary, 1],
    primaryMuted: [...primary, 0.3],
    foreground: [...foreground, 1],
    mutedForeground: [...mutedFg, 1],
    background: [...background, 1],
    card: [...card, 1],
    border: [...border, 1],
  };
}
