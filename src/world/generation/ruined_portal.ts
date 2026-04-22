// Ruined portals. Partial nether portal frames with a chest, found in
// overworld and nether. 10 shape variants × biome-specific material
// weathering. Chest loot includes iron ingots, obsidian, golden apples.

export type RuinedPortalShape =
  | 'standard'
  | 'giant'
  | 'air_portal'
  | 'side_ways'
  | 'mountain'
  | 'ocean'
  | 'portal_rubble'
  | 'underground'
  | 'nether_ceiling'
  | 'jungle';

export type PortalMaterial = 'obsidian' | 'crying_obsidian' | 'netherrack' | 'magma_block';

export interface RuinedPortalLayout {
  shape: RuinedPortalShape;
  frameBlockCount: number; // complete portals have 10 obsidian; ruined have 4..10
  missingFrames: number;
  mossCoverage: number; // 0..1
  lava: boolean;
  netherAnalog: boolean;
}

export interface RuinedPortalQuery {
  dimension: 'overworld' | 'nether';
  rng: () => number;
}

export function planRuinedPortal(q: RuinedPortalQuery): RuinedPortalLayout {
  const shape: RuinedPortalShape = pickShape(q.rng());
  const frameCount = 4 + Math.floor(q.rng() * 7); // 4..10
  const missing = 10 - frameCount;
  return {
    shape,
    frameBlockCount: frameCount,
    missingFrames: missing,
    mossCoverage: q.rng(),
    lava: q.dimension === 'nether' || q.rng() < 0.2,
    netherAnalog: q.dimension === 'nether',
  };
}

function pickShape(roll: number): RuinedPortalShape {
  const shapes: RuinedPortalShape[] = [
    'standard',
    'giant',
    'air_portal',
    'side_ways',
    'mountain',
    'ocean',
    'portal_rubble',
    'underground',
    'nether_ceiling',
    'jungle',
  ];
  const idx = Math.min(shapes.length - 1, Math.floor(roll * shapes.length));
  return shapes[idx] ?? 'standard';
}

export interface RuinedChestLoot {
  item: string;
  weight: number;
  min: number;
  max: number;
}

export const RUINED_PORTAL_LOOT: readonly RuinedChestLoot[] = [
  { item: 'webmc:flint_and_steel', weight: 5, min: 1, max: 1 },
  { item: 'webmc:fire_charge', weight: 10, min: 1, max: 2 },
  { item: 'webmc:iron_ingot', weight: 20, min: 1, max: 3 },
  { item: 'webmc:gold_ingot', weight: 10, min: 1, max: 3 },
  { item: 'webmc:golden_apple', weight: 15, min: 1, max: 1 },
  { item: 'webmc:enchanted_golden_apple', weight: 2, min: 1, max: 1 },
  { item: 'webmc:golden_carrot', weight: 12, min: 1, max: 5 },
  { item: 'webmc:obsidian', weight: 10, min: 1, max: 2 },
  { item: 'webmc:string', weight: 10, min: 1, max: 3 },
  { item: 'webmc:glistering_melon', weight: 10, min: 4, max: 12 },
];

export function rollRuinedPortalLoot(roll: number): RuinedChestLoot | null {
  const total = RUINED_PORTAL_LOOT.reduce((s, e) => s + e.weight, 0);
  const target = roll * total;
  let acc = 0;
  for (const e of RUINED_PORTAL_LOOT) {
    acc += e.weight;
    if (target < acc) return e;
  }
  return RUINED_PORTAL_LOOT[RUINED_PORTAL_LOOT.length - 1] ?? null;
}
