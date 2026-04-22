// Beehive / bee nest. Levels 0..5 fill as bees deposit. Level 5 = full;
// shears yield honeycomb, bottle yields honey. Angers bees unless
// campfire is below within 5 blocks.

export interface Beehive {
  honeyLevel: 0 | 1 | 2 | 3 | 4 | 5;
  campfireBelow: boolean;
}

export const BEEHIVE_FULL_LEVEL = 5;

export function onDeposit(h: Beehive): Beehive {
  if (h.honeyLevel >= BEEHIVE_FULL_LEVEL) return h;
  return { ...h, honeyLevel: (h.honeyLevel + 1) as Beehive['honeyLevel'] };
}

export type HarvestResult =
  | { kind: 'honeycomb'; count: number; angered: boolean }
  | { kind: 'honey_bottle'; angered: boolean }
  | { kind: 'not_ready' };

export function shear(h: Beehive): { hive: Beehive; result: HarvestResult } {
  if (h.honeyLevel < BEEHIVE_FULL_LEVEL) return { hive: h, result: { kind: 'not_ready' } };
  return {
    hive: { ...h, honeyLevel: 0 },
    result: { kind: 'honeycomb', count: 3, angered: !h.campfireBelow },
  };
}

export function bottle(h: Beehive): { hive: Beehive; result: HarvestResult } {
  if (h.honeyLevel < BEEHIVE_FULL_LEVEL) return { hive: h, result: { kind: 'not_ready' } };
  return {
    hive: { ...h, honeyLevel: 0 },
    result: { kind: 'honey_bottle', angered: !h.campfireBelow },
  };
}
