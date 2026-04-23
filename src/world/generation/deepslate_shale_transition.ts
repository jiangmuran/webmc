export const TRANSITION_MIN_Y = 0;
export const TRANSITION_MAX_Y = 8;

export function blockAtY(y: number, noiseValue: number): 'stone' | 'deepslate' {
  if (y < TRANSITION_MIN_Y) return 'deepslate';
  if (y > TRANSITION_MAX_Y) return 'stone';
  const t = (y - TRANSITION_MIN_Y) / (TRANSITION_MAX_Y - TRANSITION_MIN_Y);
  return noiseValue < t ? 'stone' : 'deepslate';
}
