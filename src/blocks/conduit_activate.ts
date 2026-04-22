// Conduit activation. Active when placed in water and surrounded by at
// least 16 prismarine blocks (prismarine / prismarine_bricks / dark_prismarine
// / sea_lantern) in a 5×5×5 frame. Activation unlocks:
//   • Conduit power to players within 16*(frame_blocks/7) blocks
//   • Attack laser against hostile underwater mobs (see conduit_drowned.ts)

export type ConduitFrameBlock =
  | 'webmc:prismarine'
  | 'webmc:prismarine_bricks'
  | 'webmc:dark_prismarine'
  | 'webmc:sea_lantern';

const FRAME_BLOCKS: ReadonlySet<string> = new Set([
  'webmc:prismarine',
  'webmc:prismarine_bricks',
  'webmc:dark_prismarine',
  'webmc:sea_lantern',
]);

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ConduitLookup {
  isWater: (x: number, y: number, z: number) => boolean;
  blockAt: (x: number, y: number, z: number) => string;
}

export interface ConduitQuery {
  pos: Vec3;
  lookup: ConduitLookup;
}

export interface ConduitStatus {
  active: boolean;
  frameBlockCount: number;
  powerRadius: number;
  attackHostiles: boolean;
}

const MIN_FRAME_BLOCKS_FOR_ACTIVATION = 16;
const FULL_FRAME_MAX = 42;

export function evaluateConduit(q: ConduitQuery): ConduitStatus {
  if (!q.lookup.isWater(q.pos.x, q.pos.y, q.pos.z)) {
    return { active: false, frameBlockCount: 0, powerRadius: 0, attackHostiles: false };
  }
  let count = 0;
  // 5×5×5 shell (excluding the conduit itself).
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      for (let dz = -2; dz <= 2; dz++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        const b = q.lookup.blockAt(q.pos.x + dx, q.pos.y + dy, q.pos.z + dz);
        if (FRAME_BLOCKS.has(b)) count++;
      }
    }
  }
  const active = count >= MIN_FRAME_BLOCKS_FOR_ACTIVATION;
  const radius = active ? Math.floor(16 * (Math.min(count, FULL_FRAME_MAX) / 7)) : 0;
  const attackHostiles = count >= FULL_FRAME_MAX;
  return { active, frameBlockCount: count, powerRadius: radius, attackHostiles };
}

export const CONDUIT_MIN_FRAME = MIN_FRAME_BLOCKS_FOR_ACTIVATION;
export const CONDUIT_FULL_FRAME = FULL_FRAME_MAX;
