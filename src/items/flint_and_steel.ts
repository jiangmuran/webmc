// Flint & steel. Right-click on a block ignites it if: (a) the top face
// is air (places a fire block), or (b) the block is TNT (primes it).
// Each use costs 1 durability.

export type IgniteTarget = 'air_top' | 'tnt' | 'obsidian_portal' | 'campfire' | 'invalid';

export interface IgniteQuery {
  target: IgniteTarget;
  durability: number;
}

export interface IgniteResult {
  accepted: boolean;
  reason?: string;
  newDurability: number;
}

export function useFlintAndSteel(q: IgniteQuery): IgniteResult {
  if (q.durability <= 0) {
    return { accepted: false, reason: 'broken', newDurability: 0 };
  }
  if (q.target === 'invalid') {
    return { accepted: false, reason: 'cant_ignite', newDurability: q.durability };
  }
  return { accepted: true, newDurability: q.durability - 1 };
}
