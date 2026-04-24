export const DEFAULT_CLOUD_HEIGHT = 192;
export const CLOUD_RENDER_DISTANCE = 192;

export function cloudsVisible(cameraY: number, cloudLayerY: number): boolean {
  return Math.abs(cameraY - cloudLayerY) < CLOUD_RENDER_DISTANCE * 2;
}

export function cloudScrollSpeed(): number {
  return 0.03;
}

export function cloudColor(weather: 'clear' | 'rain' | 'thunder'): [number, number, number] {
  if (weather === 'thunder') return [0.3, 0.3, 0.3];
  if (weather === 'rain') return [0.7, 0.7, 0.7];
  return [1, 1, 1];
}
