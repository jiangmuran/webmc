export const DEFAULT_CLOUD_HEIGHT = 192;
export const CLOUD_RENDER_DISTANCE = 192;

export function cloudsVisible(cameraY: number, cloudLayerY: number): boolean {
  return Math.abs(cameraY - cloudLayerY) < CLOUD_RENDER_DISTANCE * 2;
}

export function cloudScrollSpeed(): number {
  return 0.03;
}

// Hoisted per-weather constants — was a fresh tuple literal per call,
// and Clouds.update calls this every frame.
const CLOUD_COLOR_THUNDER: [number, number, number] = [0.3, 0.3, 0.3];
const CLOUD_COLOR_RAIN: [number, number, number] = [0.7, 0.7, 0.7];
const CLOUD_COLOR_CLEAR: [number, number, number] = [1, 1, 1];

export function cloudColor(weather: 'clear' | 'rain' | 'thunder'): [number, number, number] {
  if (weather === 'thunder') return CLOUD_COLOR_THUNDER;
  if (weather === 'rain') return CLOUD_COLOR_RAIN;
  return CLOUD_COLOR_CLEAR;
}
