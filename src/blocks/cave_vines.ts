// Cave vines with glow berries. Vine grows downward; each segment
// randomly has berries that emit light 14 and drop 1 berry when harvested.

export interface CaveVineSegment {
  hasBerries: boolean;
  isBase: boolean; // bottom = growing tip
}

export interface CaveVineColumn {
  segments: CaveVineSegment[]; // top → bottom
}

// Wiki (minecraft.wiki/w/Glow_Berries): "Each newly-grown cave vine
// block has an 11% chance of bearing glow berries." Sibling
// cave_vine_berry.ts already uses 0.11; this module had 0.10, a
// rounded approximation that under-shipped berries by ~9% relative
// to wiki canon.
const MAX_LENGTH = 26;
const GROWTH_CHANCE_PER_TICK = 0.05;
const BERRY_CHANCE = 0.11;

export function makeCaveVine(): CaveVineColumn {
  return { segments: [{ hasBerries: false, isBase: true }] };
}

export function growVine(vine: CaveVineColumn, rng: () => number = Math.random): boolean {
  if (vine.segments.length >= MAX_LENGTH) return false;
  if (rng() >= GROWTH_CHANCE_PER_TICK) return false;
  // Previous base is no longer the tip.
  for (const s of vine.segments) s.isBase = false;
  vine.segments.push({ hasBerries: rng() < BERRY_CHANCE, isBase: true });
  return true;
}

export function lightEmission(segment: CaveVineSegment): number {
  return segment.hasBerries ? 14 : 0;
}

export function harvestBerries(segment: CaveVineSegment): number {
  if (!segment.hasBerries) return 0;
  segment.hasBerries = false;
  return 1;
}

// Wiki (minecraft.wiki/w/Glow_Berries): "Using bone meal on a cave
// vine block does not grow a new vine block, unlike kelp, twisting
// vines or weeping vines. Using bone meal on any block of a cave
// vine causes it to grow glow berries, if it was not already
// bearing them."
//
// Old code APPENDED 1–2 new segments with berries — exactly the
// "extends the vine" behavior the wiki carves out as not how cave
// vines respond to bone meal. Now: add berries to all currently
// berry-less segments; consume bone meal only if at least one
// segment converts.
export function boneMealVine(vine: CaveVineColumn, rng: () => number = Math.random): number {
  void rng;
  let added = 0;
  for (const s of vine.segments) {
    if (!s.hasBerries) {
      s.hasBerries = true;
      added++;
    }
  }
  return added;
}
