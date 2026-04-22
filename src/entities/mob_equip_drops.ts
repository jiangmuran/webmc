// Mob equipment drops. Zombies/skeletons have a chance to spawn
// holding enchanted tools; these drop on death with random durability
// left.

export interface EquippedDropQuery {
  difficulty: 'easy' | 'normal' | 'hard';
  killedByPlayer: boolean;
  equippedSlot: 'mainhand' | 'head' | 'chest' | 'legs' | 'feet';
  itemId: string;
  rand: () => number;
  lootingLevel: number;
}

const DIFF_MULT: Record<'easy' | 'normal' | 'hard', number> = {
  easy: 0.02,
  normal: 0.04,
  hard: 0.08,
};

export function shouldDrop(q: EquippedDropQuery): boolean {
  if (!q.killedByPlayer) return false;
  const base = DIFF_MULT[q.difficulty];
  return q.rand() < base * (1 + q.lootingLevel * 0.05);
}

export interface DropResult {
  itemId: string;
  damageFraction: number; // 0..1 remaining durability
}

export function rollDrop(q: EquippedDropQuery): DropResult | null {
  if (!shouldDrop(q)) return null;
  return {
    itemId: q.itemId,
    damageFraction: q.rand(), // random durability left
  };
}
