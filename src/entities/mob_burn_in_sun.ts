// Sunlight burning. Undead mobs (zombie, skeleton, stray, zombie
// villager, husk, drowned out of water, phantom) ignite at sky light ≥
// 15 during daytime unless they're in water, wearing a helmet (that
// takes durability), or under a leaf/opaque block.

export type UndeadMob =
  | 'zombie'
  | 'skeleton'
  | 'stray'
  | 'zombie_villager'
  | 'husk'
  | 'drowned'
  | 'phantom'
  | 'zombified_piglin';

export interface BurnQuery {
  mob: string;
  skyLight: number;
  timeOfDay: number; // [0, 1) — 0 dawn, 0.25 noon, 0.5 dusk, 0.75 midnight
  inWater: boolean;
  inShade: boolean; // opaque block above
  wearingHelmet: boolean;
  isBabyZombie: boolean;
}

const UNDEAD_SUNBURN = new Set<UndeadMob>([
  'zombie',
  'skeleton',
  'stray',
  'zombie_villager',
  'husk',
  'drowned',
  'phantom',
]);

const HUSK_NO_BURN = true;
const ZOMBIFIED_PIGLIN_NO_BURN = true;
void HUSK_NO_BURN;
void ZOMBIFIED_PIGLIN_NO_BURN;

// Husks don't burn in sunlight (their whole thing). Zombified piglins
// also don't.
function burns(mob: string): boolean {
  if (mob === 'husk') return false;
  if (mob === 'zombified_piglin') return false;
  return UNDEAD_SUNBURN.has(mob as UndeadMob);
}

// Daytime = timeOfDay in (0.01, 0.49). Night otherwise.
function isDaytime(timeOfDay: number): boolean {
  const t = ((timeOfDay % 1) + 1) % 1;
  return t >= 0.01 && t < 0.49;
}

export interface BurnResult {
  shouldIgnite: boolean;
  helmetConsumesDurability: boolean;
}

export function evaluateSunBurn(q: BurnQuery): BurnResult {
  if (!burns(q.mob)) return { shouldIgnite: false, helmetConsumesDurability: false };
  if (!isDaytime(q.timeOfDay)) return { shouldIgnite: false, helmetConsumesDurability: false };
  if (q.skyLight < 15) return { shouldIgnite: false, helmetConsumesDurability: false };
  if (q.inWater || q.inShade) return { shouldIgnite: false, helmetConsumesDurability: false };
  if (q.wearingHelmet) {
    return { shouldIgnite: false, helmetConsumesDurability: true };
  }
  return { shouldIgnite: true, helmetConsumesDurability: false };
}

// Baby zombies move faster (1.5× speed multiplier) but same burn rules.
export function babyZombieSpeedMultiplier(isBaby: boolean): number {
  return isBaby ? 1.5 : 1;
}
