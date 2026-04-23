// Fire age. Fire blocks increment age each tick; past 15 they
// extinguish if no adjacent flammable. On soul soil / netherrack,
// fire burns forever.

export interface FireBlock {
  age: number;
  onInfiniteFuel: boolean;
}

export const FIRE_MAX_AGE = 15;

export function tick(
  f: FireBlock,
  hasFlammableAdjacent: boolean,
  rand: () => number,
): FireBlock | null {
  if (f.onInfiniteFuel) return f;
  const nextAge = Math.min(FIRE_MAX_AGE, f.age + rand() * 3);
  if (nextAge >= FIRE_MAX_AGE && !hasFlammableAdjacent) return null; // extinguish
  return { ...f, age: nextAge };
}

export function extinguishInRain(inRain: boolean, onInfiniteFuel: boolean): boolean {
  if (onInfiniteFuel) return false;
  return inRain;
}

export function infiniteFuelBlock(blockId: string): boolean {
  return blockId === 'netherrack' || blockId === 'soul_soil' || blockId === 'magma_block';
}
