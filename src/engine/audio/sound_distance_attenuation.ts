export interface AttenInput {
  distance: number;
  maxDistance: number;
  volume: number;
}

export function attenuation(i: AttenInput): number {
  if (i.distance >= i.maxDistance) return 0;
  const linear = 1 - i.distance / i.maxDistance;
  return i.volume * linear * linear;
}

export function shouldPlay(volume: number): boolean {
  return volume >= 0.001;
}

export function clampVolume(v: number): number {
  return Math.max(0, Math.min(1, v));
}
