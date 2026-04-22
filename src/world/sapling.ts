// Sapling growth. When placed with adequate light and space, a sapling
// advances a hidden growth counter each tick with some chance; once it
// reaches MAX_STAGE, it explodes into a tree (trunk + canopy) in a single
// tick. Pure — caller supplies the light sampler + the final tree blocks.

export type SaplingKind = 'oak' | 'spruce' | 'birch' | 'jungle' | 'acacia' | 'mangrove' | 'cherry';

export interface SaplingDef {
  kind: SaplingKind;
  growthChancePerTick: number;
  minLight: number;
  trunkHeight: number;
  canopyRadius: number;
  log: string;
  leaves: string;
}

export const SAPLINGS: Record<SaplingKind, SaplingDef> = {
  oak: {
    kind: 'oak',
    growthChancePerTick: 0.05,
    minLight: 9,
    trunkHeight: 5,
    canopyRadius: 2,
    log: 'webmc:oak_log',
    leaves: 'webmc:oak_leaves',
  },
  spruce: {
    kind: 'spruce',
    growthChancePerTick: 0.06,
    minLight: 9,
    trunkHeight: 7,
    canopyRadius: 2,
    log: 'webmc:spruce_log',
    leaves: 'webmc:spruce_leaves',
  },
  birch: {
    kind: 'birch',
    growthChancePerTick: 0.05,
    minLight: 9,
    trunkHeight: 6,
    canopyRadius: 2,
    log: 'webmc:birch_log',
    leaves: 'webmc:birch_leaves',
  },
  jungle: {
    kind: 'jungle',
    growthChancePerTick: 0.04,
    minLight: 9,
    trunkHeight: 10,
    canopyRadius: 3,
    log: 'webmc:jungle_log',
    leaves: 'webmc:jungle_leaves',
  },
  acacia: {
    kind: 'acacia',
    growthChancePerTick: 0.05,
    minLight: 9,
    trunkHeight: 6,
    canopyRadius: 2,
    log: 'webmc:acacia_log',
    leaves: 'webmc:acacia_leaves',
  },
  mangrove: {
    kind: 'mangrove',
    growthChancePerTick: 0.04,
    minLight: 9,
    trunkHeight: 6,
    canopyRadius: 3,
    log: 'webmc:mangrove_log',
    leaves: 'webmc:mangrove_leaves',
  },
  cherry: {
    kind: 'cherry',
    growthChancePerTick: 0.05,
    minLight: 9,
    trunkHeight: 7,
    canopyRadius: 3,
    log: 'webmc:cherry_log',
    leaves: 'webmc:cherry_leaves',
  },
};

export const SAPLING_MAX_STAGE = 4;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface SaplingTickContext {
  lightLevel: number;
  rng: () => number;
}

export function tickSapling(
  def: SaplingDef,
  currentStage: number,
  ctx: SaplingTickContext,
): number {
  if (currentStage >= SAPLING_MAX_STAGE) return currentStage;
  if (ctx.lightLevel < def.minLight) return currentStage;
  if (ctx.rng() < def.growthChancePerTick) return currentStage + 1;
  return currentStage;
}

export interface TreeBlock {
  pos: Vec3;
  block: string;
}

// Generate the blocks for a fully-grown tree at `base` (the sapling's cell).
// Simple shape: straight trunk + an elliptical canopy at the top.
export function buildTree(def: SaplingDef, base: Vec3): readonly TreeBlock[] {
  const blocks: TreeBlock[] = [];
  for (let dy = 0; dy < def.trunkHeight; dy++) {
    blocks.push({ pos: { x: base.x, y: base.y + dy, z: base.z }, block: def.log });
  }
  const canopyBaseY = base.y + def.trunkHeight - 2;
  for (let dy = 0; dy < 3; dy++) {
    const radius = dy < 2 ? def.canopyRadius : def.canopyRadius - 1;
    if (radius <= 0) continue;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        if (Math.abs(dx) === radius && Math.abs(dz) === radius && radius > 1) continue;
        if (dx === 0 && dz === 0 && dy < 2) continue; // trunk occupies center
        blocks.push({
          pos: { x: base.x + dx, y: canopyBaseY + dy, z: base.z + dz },
          block: def.leaves,
        });
      }
    }
  }
  return blocks;
}
