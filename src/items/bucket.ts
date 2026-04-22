// Bucket interactions. Empty bucket + right-click on water source →
// water bucket. Empty bucket + lava source → lava bucket. Water bucket
// + right-click on non-solid → place water source (consumes bucket).
// Fish buckets (cod, salmon, pufferfish, tropical fish, axolotl) are
// accepted by aquarium-likes.

export type BucketFill =
  | 'empty'
  | 'water'
  | 'lava'
  | 'powder_snow'
  | 'milk'
  | 'cod'
  | 'salmon'
  | 'pufferfish'
  | 'tropical_fish'
  | 'axolotl';

export interface BucketState {
  fill: BucketFill;
}

export function makeBucket(fill: BucketFill = 'empty'): BucketState {
  return { fill };
}

// Right-click on a source block → bucket picks it up.
export interface PickupQuery {
  bucket: BucketState;
  sourceBlockName: string;
}

export interface PickupResult {
  picked: boolean;
  clearBlock: boolean;
}

export function pickupSource(q: PickupQuery): PickupResult {
  if (q.bucket.fill !== 'empty') return { picked: false, clearBlock: false };
  const map: Record<string, BucketFill> = {
    'webmc:water': 'water',
    'webmc:lava': 'lava',
    'webmc:powder_snow': 'powder_snow',
  };
  const next = map[q.sourceBlockName];
  if (!next) return { picked: false, clearBlock: false };
  q.bucket.fill = next;
  return { picked: true, clearBlock: true };
}

// Right-click with a filled bucket on a passable block → place.
export interface PlaceQuery {
  bucket: BucketState;
  targetPassable: boolean;
}

export interface PlaceResult {
  placed: boolean;
  placedBlock: string | null;
}

export function placeFromBucket(q: PlaceQuery): PlaceResult {
  if (q.bucket.fill === 'empty' || !q.targetPassable) {
    return { placed: false, placedBlock: null };
  }
  const map: Record<BucketFill, string | null> = {
    empty: null,
    water: 'webmc:water',
    lava: 'webmc:lava',
    powder_snow: 'webmc:powder_snow',
    milk: null,
    cod: 'webmc:water',
    salmon: 'webmc:water',
    pufferfish: 'webmc:water',
    tropical_fish: 'webmc:water',
    axolotl: 'webmc:water',
  };
  const block = map[q.bucket.fill];
  if (!block) return { placed: false, placedBlock: null };
  q.bucket.fill = 'empty';
  return { placed: true, placedBlock: block };
}
