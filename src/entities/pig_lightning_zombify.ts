// Pig + lightning → zombified piglin. Chicken + lightning → nothing
// special. Creeper + lightning → charged creeper. Villager + lightning
// → witch.

export type LightningTarget = 'pig' | 'villager' | 'creeper' | 'turtle' | 'mooshroom' | 'other';

export interface Transformation {
  fromMobType: LightningTarget;
  toMobType: string;
}

export function transformationFor(t: LightningTarget): Transformation | null {
  switch (t) {
    case 'pig':
      return { fromMobType: 'pig', toMobType: 'webmc:zombified_piglin' };
    case 'villager':
      return { fromMobType: 'villager', toMobType: 'webmc:witch' };
    case 'creeper':
      return { fromMobType: 'creeper', toMobType: 'webmc:charged_creeper' };
    case 'mooshroom':
      return { fromMobType: 'mooshroom', toMobType: 'webmc:brown_mooshroom' };
    default:
      return null;
  }
}

// Side effects: strike also ignites nearby block as fire if flammable.
export function shouldIgniteStruckBlock(blockId: string): boolean {
  if (blockId.endsWith('_log')) return true;
  if (blockId.endsWith('_leaves')) return true;
  if (blockId === 'webmc:hay_block' || blockId === 'webmc:wool') return true;
  return false;
}
