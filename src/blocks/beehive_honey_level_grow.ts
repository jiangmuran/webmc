// Beehive honey accumulation. Tick-based; when a bee returns with
// pollen, the hive's honeyLevel increments by 1 (0..5).

export interface HiveState {
  honeyLevel: number; // 0..5
  bees: number;
  maxBees: number;
}

export const MAX_HONEY = 5;

export function makeHive(maxBees = 3): HiveState {
  return { honeyLevel: 0, bees: 0, maxBees };
}

export function beeReturnsWithPollen(h: HiveState): boolean {
  if (h.honeyLevel >= MAX_HONEY) return false;
  h.honeyLevel += 1;
  return true;
}

export function beeEnters(h: HiveState): boolean {
  if (h.bees >= h.maxBees) return false;
  h.bees += 1;
  return true;
}

export function beeExits(h: HiveState): boolean {
  if (h.bees <= 0) return false;
  h.bees -= 1;
  return true;
}

// Harvest: shears → 3 honeycomb, bottle → 1 honey bottle. Angers bees
// unless campfire below.
export interface HarvestQuery {
  tool: 'shears' | 'bottle';
  campfireBelow: boolean;
}

export interface HarvestResult {
  item: 'webmc:honeycomb' | 'webmc:honey_bottle';
  count: number;
  angersBees: boolean;
}

export function harvest(h: HiveState, q: HarvestQuery): HarvestResult | null {
  if (h.honeyLevel < MAX_HONEY) return null;
  h.honeyLevel = 0;
  return {
    item: q.tool === 'shears' ? 'webmc:honeycomb' : 'webmc:honey_bottle',
    count: q.tool === 'shears' ? 3 : 1,
    angersBees: !q.campfireBelow,
  };
}

// Overflowing honey block formation: 5-level hive stored adjacent to
// full honey-block only if configured with beehive-plus mod (omit).
