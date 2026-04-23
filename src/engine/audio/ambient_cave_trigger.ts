export interface CaveAmbientInput {
  skyLight: number;
  blockLight: number;
  insideCave: boolean;
  ticksSinceLast: number;
  rng: () => number;
}

export const CAVE_SOUND_INTERVAL_MIN = 20 * 60;
export const CAVE_SOUND_INTERVAL_MAX = 20 * 300;
export const SKY_LIGHT_THRESHOLD = 0;

export function shouldPlay(i: CaveAmbientInput): boolean {
  if (!i.insideCave) return false;
  if (i.skyLight > SKY_LIGHT_THRESHOLD) return false;
  if (i.blockLight > 4) return false;
  if (i.ticksSinceLast < CAVE_SOUND_INTERVAL_MIN) return false;
  if (i.ticksSinceLast >= CAVE_SOUND_INTERVAL_MAX) return true;
  return i.rng() < 0.01;
}
