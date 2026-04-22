// Axolotl. Lures/attacks drowned and guardians. Carried in bucket.
// "Play dead" restores HP (handled elsewhere). Breeds with tropical fish.

export type AxolotlColor = 'pink' | 'brown' | 'gold' | 'cyan' | 'blue';

export interface Axolotl {
  hp: number;
  color: AxolotlColor;
  inBucket: boolean;
}

export function naturalColor(rand: () => number): AxolotlColor {
  const r = rand();
  if (r < 0.01) return 'blue'; // rare
  if (r < 0.26) return 'pink';
  if (r < 0.51) return 'brown';
  if (r < 0.76) return 'gold';
  return 'cyan';
}

// Target selection: axolotls hate guardians, elder guardians, drowned,
// all underwater hostile mobs.
const HATED = new Set<string>([
  'guardian',
  'elder_guardian',
  'drowned',
  'squid',
  'glow_squid',
  'pufferfish',
]);

export function isHatedMob(mobType: string): boolean {
  return HATED.has(mobType);
}

// Bucket pickup: transforms the axolotl into a water_bucket_axolotl
// item that preserves HP + color.
export interface BucketPickup {
  axolotl: Axolotl;
  emptyBucket: boolean;
}

export function tryBucket(q: BucketPickup): { ok: boolean; itemId?: string } {
  if (!q.emptyBucket) return { ok: false };
  q.axolotl.inBucket = true;
  return { ok: true, itemId: 'webmc:axolotl_bucket' };
}

// Release: place water_bucket_axolotl on water source spawns the axolotl back.
export function releaseFromBucket(a: Axolotl): void {
  a.inBucket = false;
}
