// Two-tall plants (sunflower, lilac, rose bush, peony, tall grass,
// large fern). Need clearance for both lower + upper cell; break both
// together.

export type TallPlantId =
  | 'webmc:sunflower'
  | 'webmc:lilac'
  | 'webmc:rose_bush'
  | 'webmc:peony'
  | 'webmc:tall_grass'
  | 'webmc:large_fern'
  | 'webmc:pitcher_plant';

export interface PlaceQuery {
  lowerCellAir: boolean;
  upperCellAir: boolean;
  groundBlockId: string;
}

const VALID_GROUND = new Set<string>([
  'webmc:grass_block',
  'webmc:dirt',
  'webmc:podzol',
  'webmc:coarse_dirt',
  'webmc:rooted_dirt',
  'webmc:moss_block',
  'webmc:mud',
  'webmc:farmland',
]);

export function canPlaceTall(q: PlaceQuery): boolean {
  if (!q.lowerCellAir || !q.upperCellAir) return false;
  return VALID_GROUND.has(q.groundBlockId);
}

// Breaking bottom half → drop flower item; breaking top half → break
// bottom too and drop item.
export interface BreakQuery {
  plantId: TallPlantId;
  wasHalf: 'upper' | 'lower';
}

export interface BreakResult {
  removeUpper: boolean;
  removeLower: boolean;
  drop: { id: string; count: number } | null;
}

export function onBreak(q: BreakQuery): BreakResult {
  // Always removes both halves; drops yield determined by plant.
  return {
    removeUpper: true,
    removeLower: true,
    drop: { id: q.plantId, count: 1 },
  };
}
