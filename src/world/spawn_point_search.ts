// Spawn point search. When a world is created, a spawn point is
// picked near (0, 0) on a non-water surface. Also used when a bed
// respawn fails and we need a fallback.

export interface ColumnQuery {
  groundY: number;
  surfaceBlockId: string;
  skyAccess: boolean;
}

export interface SearchQuery {
  centerX: number;
  centerZ: number;
  maxRadius: number;
  column: (x: number, z: number) => ColumnQuery;
}

const INVALID_SURFACES = new Set([
  'webmc:water',
  'webmc:lava',
  'webmc:ice',
  'webmc:packed_ice',
  'webmc:blue_ice',
  'webmc:cactus',
  'webmc:magma_block',
]);

export function isValidSpawn(c: ColumnQuery): boolean {
  if (!c.skyAccess) return false;
  if (INVALID_SURFACES.has(c.surfaceBlockId)) return false;
  return true;
}

// Spiral search outward from center; pick first valid.
export function findSpawn(q: SearchQuery): { x: number; y: number; z: number } | null {
  for (let r = 0; r <= q.maxRadius; r++) {
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        const x = q.centerX + dx;
        const z = q.centerZ + dz;
        const col = q.column(x, z);
        if (isValidSpawn(col)) {
          return { x, y: col.groundY + 1, z };
        }
      }
    }
  }
  return null;
}
