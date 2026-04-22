// Saddles cannot be crafted. They drop from fishing, chests in dungeons
// and nether fortresses, and wandering-trader trades. Placing a saddle
// on a tameable mount makes it ridable.

export type SaddleSource =
  | 'fishing_treasure'
  | 'dungeon_chest'
  | 'nether_fortress_chest'
  | 'end_city_chest'
  | 'desert_temple_chest'
  | 'trader_trade';

export interface SaddleDropChance {
  source: SaddleSource;
  chance: number;
}

const DROP_CHANCES: readonly SaddleDropChance[] = [
  { source: 'fishing_treasure', chance: 0.017 },
  { source: 'dungeon_chest', chance: 0.28 },
  { source: 'nether_fortress_chest', chance: 0.35 },
  { source: 'end_city_chest', chance: 0.14 },
  { source: 'desert_temple_chest', chance: 0.24 },
  { source: 'trader_trade', chance: 0.5 },
];

export function saddleDropChance(source: SaddleSource): number {
  return DROP_CHANCES.find((d) => d.source === source)?.chance ?? 0;
}

// Which mobs accept a saddle (only when tamed/adult, as applicable).
export type SaddleableMob =
  | 'horse'
  | 'donkey'
  | 'mule'
  | 'skeleton_horse'
  | 'zombie_horse'
  | 'pig'
  | 'strider'
  | 'camel';

const SADDLEABLE = new Set<SaddleableMob>([
  'horse',
  'donkey',
  'mule',
  'skeleton_horse',
  'zombie_horse',
  'pig',
  'strider',
  'camel',
]);

export function canSaddle(mob: string): boolean {
  return SADDLEABLE.has(mob as SaddleableMob);
}

// Mobs that need to be tamed before a saddle can be applied.
const TAME_FIRST: ReadonlySet<SaddleableMob> = new Set(['horse', 'donkey', 'mule', 'camel']);

export function requiresTameBeforeSaddle(mob: SaddleableMob): boolean {
  return TAME_FIRST.has(mob);
}

export interface SaddleApplyResult {
  saddled: boolean;
  reason?: 'not_saddleable' | 'not_tame' | 'already_saddled';
}

export interface SaddleApplyQuery {
  mob: string;
  isTame: boolean;
  alreadySaddled: boolean;
}

export function applySaddle(q: SaddleApplyQuery): SaddleApplyResult {
  if (!canSaddle(q.mob)) return { saddled: false, reason: 'not_saddleable' };
  if (q.alreadySaddled) return { saddled: false, reason: 'already_saddled' };
  if (requiresTameBeforeSaddle(q.mob as SaddleableMob) && !q.isTame) {
    return { saddled: false, reason: 'not_tame' };
  }
  return { saddled: true };
}
