// Nether wart. Plant on soul sand; 4 stages (0-3). Grows at any light
// level, slower than overworld crops. Drops 2-4 at stage 3 (fortune
// scales).

export const MAX_AGE = 3;

export interface NetherWart {
  age: number;
}

export function makeNetherWart(): NetherWart {
  return { age: 0 };
}

export interface GrowQuery {
  onSoulSand: boolean;
  rand: () => number;
}

export function randomTick(n: NetherWart, q: GrowQuery): 'grew' | 'noop' {
  if (!q.onSoulSand) return 'noop';
  if (n.age >= MAX_AGE) return 'noop';
  if (q.rand() < 0.1) {
    n.age += 1;
    return 'grew';
  }
  return 'noop';
}

export function breakDrops(n: NetherWart, fortuneLevel: number, rand: () => number): number {
  if (n.age < MAX_AGE) return 1;
  const base = 2 + Math.floor(rand() * 3); // 2..4
  // Wiki (minecraft.wiki/w/Nether_Wart#Drops): fortune adds a uniform
  // 0..level bonus, not a deterministic +level. Old formula gave the
  // full level every time (e.g. Fortune III always +3) instead of the
  // wiki's 0..3 roll. Cap remains 8 to match wiki's hard maximum.
  const fortuneBonus = fortuneLevel > 0 ? Math.floor(rand() * (fortuneLevel + 1)) : 0;
  return Math.min(8, base + fortuneBonus);
}

// Bone meal does not work on nether wart (vanilla).
export function boneMealWorks(): boolean {
  return false;
}
