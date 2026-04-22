// Heightmap kinds. Each chunk maintains several heightmaps for
// efficient surface queries.

export type HeightmapKind =
  | 'world_surface'
  | 'world_surface_wg' // during generation
  | 'ocean_floor'
  | 'ocean_floor_wg'
  | 'motion_blocking'
  | 'motion_blocking_no_leaves';

export type HeightmapPredicate = (blockId: string) => boolean;

const AIR = new Set<string>(['webmc:air', 'webmc:cave_air', 'webmc:void_air']);
const MOTION_BLOCKING_IDS = new Set<string>(); // unused placeholder; use fn below

export function isAir(id: string): boolean {
  return AIR.has(id);
}

export function predicateFor(kind: HeightmapKind): HeightmapPredicate {
  switch (kind) {
    case 'world_surface':
    case 'world_surface_wg':
      return (id) => !isAir(id);
    case 'ocean_floor':
    case 'ocean_floor_wg':
      return (id) => !isAir(id) && id !== 'webmc:water' && id !== 'webmc:lava';
    case 'motion_blocking':
      return (id) => !isAir(id) && !isPassthrough(id);
    case 'motion_blocking_no_leaves':
      return (id) => !isAir(id) && !isPassthrough(id) && !id.endsWith('_leaves');
  }
}

function isPassthrough(id: string): boolean {
  if (id.endsWith('_sapling')) return true;
  if (id.endsWith('_flower')) return true;
  if (id === 'webmc:grass' || id === 'webmc:tall_grass' || id === 'webmc:fern') return true;
  return false;
}

export { MOTION_BLOCKING_IDS };
