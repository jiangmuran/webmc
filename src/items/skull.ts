// Skull items — wearable heads that also decorate blocks. Each variant
// has a head shape, a light emission (dragon head glows), and a wither-
// summon role (skeleton / wither skeleton / zombie / creeper all valid
// head blocks; only wither_skeleton triggers the wither summon recipe).

export type SkullKind =
  | 'player_head'
  | 'zombie_head'
  | 'skeleton_skull'
  | 'wither_skeleton_skull'
  | 'creeper_head'
  | 'dragon_head'
  | 'piglin_head';

export interface SkullDef {
  kind: SkullKind;
  display: string;
  reduceMobDetection: boolean; // wearing the matching mob's head reduces sight
  lightEmission: number;
  witherSummon: boolean;
}

export const SKULLS: Record<SkullKind, SkullDef> = {
  player_head: {
    kind: 'player_head',
    display: 'Player Head',
    reduceMobDetection: false,
    lightEmission: 0,
    witherSummon: false,
  },
  zombie_head: {
    kind: 'zombie_head',
    display: 'Zombie Head',
    reduceMobDetection: true,
    lightEmission: 0,
    witherSummon: false,
  },
  skeleton_skull: {
    kind: 'skeleton_skull',
    display: 'Skeleton Skull',
    reduceMobDetection: true,
    lightEmission: 0,
    witherSummon: false,
  },
  wither_skeleton_skull: {
    kind: 'wither_skeleton_skull',
    display: 'Wither Skeleton Skull',
    reduceMobDetection: true,
    lightEmission: 0,
    witherSummon: true,
  },
  creeper_head: {
    kind: 'creeper_head',
    display: 'Creeper Head',
    reduceMobDetection: true,
    lightEmission: 0,
    witherSummon: false,
  },
  dragon_head: {
    kind: 'dragon_head',
    display: 'Dragon Head',
    reduceMobDetection: false,
    lightEmission: 0,
    witherSummon: false,
  },
  piglin_head: {
    kind: 'piglin_head',
    display: 'Piglin Head',
    reduceMobDetection: true,
    lightEmission: 0,
    witherSummon: false,
  },
};

// Wither summon: 3 wither skeleton skulls atop 4 soul sand / soul soil in a
// T shape. Returns true if a T formation is present.
export interface WitherLookup {
  blockName(x: number, y: number, z: number): string;
}

export function detectWitherSummon(
  origin: { x: number; y: number; z: number },
  lookup: WitherLookup,
): boolean {
  // Base layer: T of soul sand / soul soil.
  const isSoul = (x: number, y: number, z: number): boolean => {
    const n = lookup.blockName(x, y, z);
    return n === 'webmc:soul_sand' || n === 'webmc:soul_soil';
  };
  // Bottom row (vertical bar of T) at y=0.
  if (!isSoul(origin.x, origin.y, origin.z)) return false;
  if (!isSoul(origin.x - 1, origin.y + 1, origin.z)) return false;
  if (!isSoul(origin.x, origin.y + 1, origin.z)) return false;
  if (!isSoul(origin.x + 1, origin.y + 1, origin.z)) return false;
  // Three skulls on top row.
  const skullAt = (x: number, y: number, z: number): boolean =>
    lookup.blockName(x, y, z) === 'webmc:wither_skeleton_skull';
  return (
    skullAt(origin.x - 1, origin.y + 2, origin.z) &&
    skullAt(origin.x, origin.y + 2, origin.z) &&
    skullAt(origin.x + 1, origin.y + 2, origin.z)
  );
}
