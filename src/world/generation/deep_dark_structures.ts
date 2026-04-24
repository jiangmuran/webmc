export interface DeepDarkInput {
  y: number;
  inAncientCity: boolean;
  rng: () => number;
}

export const ANCIENT_CITY_MAX_Y = -1;
export const WARDEN_SPAWN_ATTEMPT_Y = -52;

export function canHoldSculk(y: number): boolean {
  return y <= 0;
}

export function spawnsSculkShrieker(i: DeepDarkInput): boolean {
  if (i.y > ANCIENT_CITY_MAX_Y) return false;
  return i.inAncientCity && i.rng() < 0.01;
}

export function wardenSpawnEligible(y: number): boolean {
  return y <= WARDEN_SPAWN_ATTEMPT_Y;
}

export function lootTier(i: DeepDarkInput): 'music_disc_5' | 'echo_shard' | 'regular' {
  if (!i.inAncientCity) return 'regular';
  const r = i.rng();
  if (r < 0.02) return 'music_disc_5';
  if (r < 0.1) return 'echo_shard';
  return 'regular';
}
