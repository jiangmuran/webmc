// Breeding across all animals. Feeding the food item enters "in love"
// for 30s. Two in-love animals within 8 blocks pair and breed (baby +
// 1-7 XP). Per-animal 5-minute cooldown after birth.

export interface BreedableMob {
  inLoveUntilMs: number;
  breedCooldownUntilMs: number;
  acceptedFoodIds: Set<string>;
}

export const IN_LOVE_DURATION_MS = 30_000;
export const BREED_COOLDOWN_MS = 5 * 60_000;
export const BREED_PARTNER_RADIUS = 8;

export function makeMob(foods: string[]): BreedableMob {
  return {
    inLoveUntilMs: 0,
    breedCooldownUntilMs: 0,
    acceptedFoodIds: new Set(foods),
  };
}

export interface FeedQuery {
  foodId: string;
  nowMs: number;
}

export type FeedResult = 'entered_love' | 'wrong_food' | 'on_cooldown' | 'already_in_love';

export function feed(m: BreedableMob, q: FeedQuery): FeedResult {
  if (!m.acceptedFoodIds.has(q.foodId)) return 'wrong_food';
  if (q.nowMs < m.breedCooldownUntilMs) return 'on_cooldown';
  if (q.nowMs < m.inLoveUntilMs) return 'already_in_love';
  m.inLoveUntilMs = q.nowMs + IN_LOVE_DURATION_MS;
  return 'entered_love';
}

export interface PairQuery {
  a: BreedableMob;
  b: BreedableMob;
  aPos: { x: number; y: number; z: number };
  bPos: { x: number; y: number; z: number };
  nowMs: number;
}

export function canBreedTogether(q: PairQuery): boolean {
  if (q.nowMs >= q.a.inLoveUntilMs || q.nowMs >= q.b.inLoveUntilMs) return false;
  const dx = q.aPos.x - q.bPos.x;
  const dy = q.aPos.y - q.bPos.y;
  const dz = q.aPos.z - q.bPos.z;
  return dx * dx + dy * dy + dz * dz <= BREED_PARTNER_RADIUS * BREED_PARTNER_RADIUS;
}

export function consummate(a: BreedableMob, b: BreedableMob, nowMs: number): void {
  a.inLoveUntilMs = 0;
  b.inLoveUntilMs = 0;
  a.breedCooldownUntilMs = nowMs + BREED_COOLDOWN_MS;
  b.breedCooldownUntilMs = nowMs + BREED_COOLDOWN_MS;
}
