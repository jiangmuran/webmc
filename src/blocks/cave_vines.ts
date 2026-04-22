// Cave vines with glow berries. Vine grows downward; each segment
// randomly has berries that emit light 14 and drop 1 berry when harvested.

export interface CaveVineSegment {
  hasBerries: boolean;
  isBase: boolean; // bottom = growing tip
}

export interface CaveVineColumn {
  segments: CaveVineSegment[]; // top → bottom
}

const MAX_LENGTH = 26;
const GROWTH_CHANCE_PER_TICK = 0.05;
const BERRY_CHANCE = 0.1;

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

// Apply bone meal to the tip: 100% chance to add 1-2 segments with
// berries on them.
export function boneMealVine(vine: CaveVineColumn, rng: () => number = Math.random): number {
  const count = 1 + Math.floor(rng() * 2);
  let added = 0;
  for (let i = 0; i < count && vine.segments.length < MAX_LENGTH; i++) {
    for (const s of vine.segments) s.isBase = false;
    vine.segments.push({ hasBerries: true, isBase: true });
    added++;
  }
  return added;
}
