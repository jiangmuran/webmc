// Ocean monument layout. 58×22×58 prismarine structure at the bottom of
// deep ocean biomes; inhabited by 3 elder guardians and many guardians.
// Monument has a central treasure room with 8 gold blocks behind
// sponge-sealed walls.

export type MonumentRoom =
  | 'entry_hall'
  | 'corridor'
  | 'pillar_room'
  | 'spawner_pit'
  | 'throne'
  | 'side_wing'
  | 'treasure_core'
  | 'elder_chamber';

export interface MonumentRoomDef {
  kind: MonumentRoom;
  minCount: number;
  maxCount: number;
}

export const MONUMENT_ROOMS: Record<MonumentRoom, MonumentRoomDef> = {
  entry_hall: { kind: 'entry_hall', minCount: 1, maxCount: 1 },
  corridor: { kind: 'corridor', minCount: 4, maxCount: 8 },
  pillar_room: { kind: 'pillar_room', minCount: 2, maxCount: 4 },
  spawner_pit: { kind: 'spawner_pit', minCount: 1, maxCount: 2 },
  throne: { kind: 'throne', minCount: 1, maxCount: 1 },
  side_wing: { kind: 'side_wing', minCount: 2, maxCount: 2 },
  treasure_core: { kind: 'treasure_core', minCount: 1, maxCount: 1 },
  elder_chamber: { kind: 'elder_chamber', minCount: 3, maxCount: 3 },
};

export interface MonumentPlan {
  rooms: readonly { kind: MonumentRoom; count: number }[];
  elderGuardianCount: number;
  goldBlocksInTreasure: number;
  boundingBox: { width: number; height: number; depth: number };
}

export interface MonumentQuery {
  rng: () => number;
}

export function planMonument(q: MonumentQuery): MonumentPlan {
  const rooms: { kind: MonumentRoom; count: number }[] = [];
  for (const def of Object.values(MONUMENT_ROOMS)) {
    const span = def.maxCount - def.minCount + 1;
    const n = def.minCount + Math.floor(q.rng() * span);
    rooms.push({ kind: def.kind, count: n });
  }
  return {
    rooms,
    elderGuardianCount: 3,
    goldBlocksInTreasure: 8,
    boundingBox: { width: 58, height: 22, depth: 58 },
  };
}

// Mining an elder guardian drops 1 prismarine shard + a rare wet sponge.
// The treasure core's 8 gold blocks are behind 4 sponge-sealed walls;
// breaking each wall reveals 2 gold blocks.
export function isInsideMonument(
  pos: { x: number; y: number; z: number },
  anchor: { x: number; y: number; z: number },
): boolean {
  const dx = pos.x - anchor.x;
  const dy = pos.y - anchor.y;
  const dz = pos.z - anchor.z;
  return dx >= 0 && dx < 58 && dy >= 0 && dy < 22 && dz >= 0 && dz < 58;
}
