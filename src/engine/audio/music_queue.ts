export interface Track {
  id: string;
  biome: string;
  durationTicks: number;
}

export interface QueueState {
  now?: Track;
  cooldownTicks: number;
  lastPlayedAtTick: number;
}

export const MIN_COOLDOWN = 6000;
export const MAX_COOLDOWN = 24000;

export function shouldPickNew(s: QueueState, nowTick: number): boolean {
  if (!s.now) return nowTick - s.lastPlayedAtTick >= s.cooldownTicks;
  return false;
}

export function pickCooldown(rng: () => number): number {
  return MIN_COOLDOWN + Math.floor(rng() * (MAX_COOLDOWN - MIN_COOLDOWN));
}
