// Axolotl. Lures/attacks drowned and guardians. Carried in bucket.
// "Play dead" restores HP (handled elsewhere). Breeds with tropical fish.

export type AxolotlColor = 'pink' | 'brown' | 'gold' | 'cyan' | 'blue';

export interface Axolotl {
  hp: number;
  color: AxolotlColor;
  inBucket: boolean;
}

// Wiki (minecraft.wiki/w/Axolotl#Spawning): natural spawns are pink/
// brown/gold/cyan with equal probability. Blue can only be obtained
// by breeding two non-blue axolotls (1/1200 per breed). Old version
// generated blue 1% of the time on natural spawn — not vanilla.
export function naturalColor(rand: () => number): AxolotlColor {
  const r = rand();
  if (r < 0.25) return 'pink';
  if (r < 0.5) return 'brown';
  if (r < 0.75) return 'gold';
  return 'cyan';
}

// Breeding mutation chance for blue (per wiki: 1 in 1200).
export const BLUE_BREED_CHANCE = 1 / 1200;

export function breedColor(
  parentA: AxolotlColor,
  parentB: AxolotlColor,
  rand: () => number,
): AxolotlColor {
  if (rand() < BLUE_BREED_CHANCE) return 'blue';
  return rand() < 0.5 ? parentA : parentB;
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
