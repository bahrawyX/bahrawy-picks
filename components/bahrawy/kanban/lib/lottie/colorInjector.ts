import type { LottieColorPalette } from './themeColors';

/**
 * Maps layer names (as defined in the animation JSON) to palette keys.
 * This is the contract between the animation designer and the code.
 */
export type LayerColorMap = Record<string, keyof LottieColorPalette>;
