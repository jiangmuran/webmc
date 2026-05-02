// Wiki (minecraft.wiki/w/Composter): the composter block-state `level`
// runs 0..8 (9 states). Level 8 is the "ready" state with compost
// visible; right-clicking a level-8 composter yields one bone meal
// and resets to 0. Levels 1..7 are intermediate filling stages.
// Old MAX_LEVEL=7 conflated "ready" with the highest filling stage,
// silently capping the filling early — players would see compost at
// level 7 (no fill animation) and right-click to harvest before the
// in-game level-8 state existed. Sibling composter.ts already uses 8.
export const MAX_LEVEL = 8;

export interface Composter {
  level: number;
}

// Wiki explicitly excludes bamboo from compostables (MC-142452,
// confirmed WAI: "Despite being plants, it is not possible to
// compost bamboo... too fibrous"). Old table happily accepted
// bamboo at 30% — letting bamboo farms feed bone-meal generators,
// which the wiki carves out as the canonical "things you can't
// shortcut into compost."
const COMPOST_CHANCE: Record<string, number> = {
  wheat_seeds: 0.3,
  beetroot_seeds: 0.3,
  sweet_berries: 0.3,
  apple: 0.65,
  carrot: 0.65,
  potato: 0.65,
  wheat: 0.65,
  baked_potato: 0.85,
  bread: 0.85,
  cookie: 0.85,
  hay_block: 0.85,
  cake: 1,
  pumpkin_pie: 1,
};

export function compostChance(id: string): number {
  return COMPOST_CHANCE[id] ?? 0;
}

export function addItem(c: Composter, id: string, rng: () => number): Composter {
  if (c.level >= MAX_LEVEL) return c;
  const chance = compostChance(id);
  if (chance === 0) return c;
  if (rng() < chance) return { level: Math.min(MAX_LEVEL, c.level + 1) };
  return c;
}

export function isReady(c: Composter): boolean {
  return c.level === MAX_LEVEL;
}

export function collectBonemeal(c: Composter): { result: Composter; yielded: boolean } {
  if (c.level !== MAX_LEVEL) return { result: c, yielded: false };
  return { result: { level: 0 }, yielded: true };
}
