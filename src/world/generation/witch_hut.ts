// Swamp witch hut. 7×7×8 stilted hut in swamp biomes with one witch
// permanently tied to it (never despawns, always respawns) and a
// cauldron + crafting table + mushrooms inside. The witch is considered
// "persistent" as soon as she spawns within the hut bounds.

export interface WitchHutLayout {
  size: { width: number; height: number; depth: number };
  stiltCount: number;
  interior: readonly { block: string; x: number; y: number; z: number }[];
  persistentWitch: boolean;
}

export function witchHutLayout(anchor: { x: number; y: number; z: number }): WitchHutLayout {
  return {
    size: { width: 7, height: 8, depth: 7 },
    stiltCount: 4,
    interior: [
      { block: 'webmc:cauldron', x: anchor.x + 4, y: anchor.y + 2, z: anchor.z + 2 },
      { block: 'webmc:crafting_table', x: anchor.x + 2, y: anchor.y + 2, z: anchor.z + 4 },
      { block: 'webmc:red_mushroom', x: anchor.x + 1, y: anchor.y + 2, z: anchor.z + 1 },
    ],
    persistentWitch: true,
  };
}

// A witch inside its home hut is considered persistent (doesn't despawn).
// The hut's AABB in MC is the 7×7 footprint × 8 height from anchor.
export function witchIsInsideHome(
  witchPos: { x: number; y: number; z: number },
  huntAnchor: { x: number; y: number; z: number },
): boolean {
  const dx = witchPos.x - huntAnchor.x;
  const dy = witchPos.y - huntAnchor.y;
  const dz = witchPos.z - huntAnchor.z;
  return dx >= 0 && dx < 7 && dy >= 0 && dy < 8 && dz >= 0 && dz < 7;
}
