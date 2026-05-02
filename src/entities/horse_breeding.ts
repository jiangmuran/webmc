// Wiki (minecraft.wiki/w/Horse#Breeding): foal stats follow
// (parent1 + parent2 + R) / 3 where R is uniform-random in:
//   Health 15..30, Speed 0.1125..0.3375, Jump 0.4..1.0.
//
// Old code used `(p1 + p2)/2 + (rng-0.5) × range × 0.1`, which:
//   - lacks the regression-toward-mean property the wiki formula has
//     (two top-tier parents always produced top-tier foals);
//   - applied a tiny ±5% jitter instead of the wiki's full-range R
//     term — natural-spawn statistical spread was effectively
//     impossible for foals to reach.
// Sibling horse_breed_traits.ts and horse_breed_inheritance.ts use
// the wiki formula; this module now matches.

export interface HorseStats {
  maxHealth: number; // 15..30 in MC
  movementSpeed: number; // 0.1125..0.3375
  jumpStrength: number; // 0.4..1.0
}

export interface BreedQuery {
  parentA: HorseStats;
  parentB: HorseStats;
  rng: () => number;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function breedOne(a: number, b: number, rng: () => number, lo: number, hi: number): number {
  // Wiki R is uniform in [lo, hi]; foal = (a + b + R) / 3.
  const r = lo + rng() * (hi - lo);
  return clamp((a + b + r) / 3, lo, hi);
}

export function breedHorses(q: BreedQuery): HorseStats {
  return {
    maxHealth: breedOne(q.parentA.maxHealth, q.parentB.maxHealth, q.rng, 15, 30),
    movementSpeed: breedOne(
      q.parentA.movementSpeed,
      q.parentB.movementSpeed,
      q.rng,
      0.1125,
      0.3375,
    ),
    jumpStrength: breedOne(q.parentA.jumpStrength, q.parentB.jumpStrength, q.rng, 0.4, 1.0),
  };
}

// Natural range picker for a brand-new wild horse.
export function wildHorseStats(rng: () => number): HorseStats {
  return {
    maxHealth: 15 + Math.floor(rng() * 16),
    movementSpeed: 0.1125 + rng() * 0.225,
    jumpStrength: 0.4 + rng() * 0.6,
  };
}

// Donkey + horse = mule (infertile); same breed formula.
export function breedToMule(q: BreedQuery): HorseStats & { mule: true; infertile: true } {
  const stats = breedHorses(q);
  return { ...stats, mule: true, infertile: true };
}

// Skeleton horse + horse = not possible; undead horses don't breed.
export function canBreed(
  a: 'horse' | 'donkey' | 'mule' | 'skeleton_horse' | 'zombie_horse',
  b: 'horse' | 'donkey' | 'mule' | 'skeleton_horse' | 'zombie_horse',
): boolean {
  if (a === 'mule' || b === 'mule') return false;
  if (a === 'skeleton_horse' || b === 'skeleton_horse') return false;
  if (a === 'zombie_horse' || b === 'zombie_horse') return false;
  return true;
}
