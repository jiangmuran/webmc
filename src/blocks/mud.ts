// Mud, packed mud, mud brick. Mud is placed by using a water bottle on
// dirt; packed mud is made by combining mud + wheat in the crafting grid;
// mud bricks are smelted from packed mud and used as a building material.

export type MudBlock =
  | 'webmc:mud'
  | 'webmc:packed_mud'
  | 'webmc:mud_bricks'
  | 'webmc:mud_brick_slab'
  | 'webmc:mud_brick_stairs'
  | 'webmc:mud_brick_wall';

// Use a water bottle on dirt converts it to mud, consuming the bottle.
export interface MuddifyQuery {
  target: string;
  hasWaterBottle: boolean;
}

export interface MuddifyResult {
  ok: boolean;
  converted: string | null;
  consumedWaterBottle: boolean;
}

export function tryMuddify(q: MuddifyQuery): MuddifyResult {
  if (!q.hasWaterBottle) {
    return { ok: false, converted: null, consumedWaterBottle: false };
  }
  if (
    q.target === 'webmc:dirt' ||
    q.target === 'webmc:coarse_dirt' ||
    q.target === 'webmc:rooted_dirt'
  ) {
    return { ok: true, converted: 'webmc:mud', consumedWaterBottle: true };
  }
  return { ok: false, converted: null, consumedWaterBottle: false };
}

// Dripping water from a stalactite + mud below drips water onto a mud
// column; the bottom mud turns into clay.
export function dripToClay(
  mudPositions: readonly { x: number; y: number; z: number }[],
): { x: number; y: number; z: number } | null {
  // lowest Y becomes clay.
  let lowest: { x: number; y: number; z: number } | null = null;
  for (const p of mudPositions) {
    if (lowest === null || p.y < lowest.y) lowest = p;
  }
  return lowest;
}

// Crafting: mud + wheat (1×1) = packed mud.
export interface PackMudQuery {
  mud: number;
  wheat: number;
}

export function craftPackedMud(q: PackMudQuery): { item: 'webmc:packed_mud'; count: 1 } | null {
  if (q.mud < 1 || q.wheat < 1) return null;
  return { item: 'webmc:packed_mud', count: 1 };
}

// Smelting: 1 packed mud → 1 mud brick (0.1 XP).
export function smeltPackedMud(): { item: 'webmc:mud_brick'; count: 1 } {
  return { item: 'webmc:mud_brick', count: 1 };
}

// Mud slows entities that stand on it (~0.85× walk speed like honey).
export const MUD_SPEED_MULTIPLIER = 0.85;

export function speedOnMud(baseSpeed: number): number {
  return baseSpeed * MUD_SPEED_MULTIPLIER;
}
