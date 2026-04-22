// Silverfish summon. When an infested block is broken, a silverfish
// spawns. Silverfish also call nearby silverfish-in-infested-blocks
// when damaged (summon radius 21x11x21).

export interface SummonQuery {
  damagePos: { x: number; y: number; z: number };
  infestedBlocksInRange: { x: number; y: number; z: number }[];
}

export const SUMMON_RADIUS_XZ = 10;
export const SUMMON_RADIUS_Y = 5;

export function summonedByDamage(q: SummonQuery): { x: number; y: number; z: number }[] {
  return q.infestedBlocksInRange.filter((p) => {
    return (
      Math.abs(p.x - q.damagePos.x) <= SUMMON_RADIUS_XZ &&
      Math.abs(p.z - q.damagePos.z) <= SUMMON_RADIUS_XZ &&
      Math.abs(p.y - q.damagePos.y) <= SUMMON_RADIUS_Y
    );
  });
}

// Infested block variants
export type InfestedVariant =
  | 'infested_stone'
  | 'infested_cobblestone'
  | 'infested_stone_bricks'
  | 'infested_mossy_stone_bricks'
  | 'infested_cracked_stone_bricks'
  | 'infested_chiseled_stone_bricks'
  | 'infested_deepslate';

const HOST: Record<InfestedVariant, string> = {
  infested_stone: 'webmc:stone',
  infested_cobblestone: 'webmc:cobblestone',
  infested_stone_bricks: 'webmc:stone_bricks',
  infested_mossy_stone_bricks: 'webmc:mossy_stone_bricks',
  infested_cracked_stone_bricks: 'webmc:cracked_stone_bricks',
  infested_chiseled_stone_bricks: 'webmc:chiseled_stone_bricks',
  infested_deepslate: 'webmc:deepslate',
};

export function hostBlock(variant: InfestedVariant): string {
  return HOST[variant];
}
