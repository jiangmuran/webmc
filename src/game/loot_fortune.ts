// Fortune drop boost. Applies only when the correct tool is used.
// Fortune I/II/III boosts drops for ores + crops + grass (seeds) + glowstone.
//
// Ore drops (coal, diamond, emerald, lapis, redstone, copper, nether_quartz):
//   Fortune uses MC's "discrete" formula — per level, pick a uniform
//   integer in [0, level+1], add it to the base drop count; keep the max
//   among (level+2) rolls.
//
// Crops use a "binomial" formula: chance 2/(3-level) for each bonus drop.

export interface FortuneQuery {
  baseDrop: number;
  level: number; // 0..3
  rng: () => number;
  kind: 'ore' | 'crop' | 'glowstone' | 'other';
}

export function applyFortune(q: FortuneQuery): number {
  const level = Math.max(0, Math.min(3, q.level));
  if (level === 0) return q.baseDrop;
  if (q.kind === 'ore') {
    let best = q.baseDrop;
    for (let i = 0; i < level + 2; i++) {
      const bonus = Math.floor(q.rng() * (level + 1));
      const candidate = q.baseDrop * (bonus + 1);
      if (candidate > best) best = candidate;
    }
    return best;
  }
  if (q.kind === 'crop') {
    let total = q.baseDrop;
    const chance = 2 / (3 - Math.min(2, level));
    for (let i = 0; i < level; i++) {
      if (q.rng() < chance) total++;
    }
    return total;
  }
  if (q.kind === 'glowstone') {
    // Max drops = 4 without fortune, up to 4 with fortune (caps)
    return Math.min(4, q.baseDrop + Math.floor(q.rng() * (level + 1)));
  }
  return q.baseDrop;
}

// Looting uses a similar model (see entities/mob_looting.ts); this
// table just exposes which tools qualify for fortune.

const FORTUNEABLE_ORES = new Set([
  'webmc:coal_ore',
  'webmc:diamond_ore',
  'webmc:emerald_ore',
  'webmc:lapis_ore',
  'webmc:redstone_ore',
  'webmc:copper_ore',
  'webmc:nether_quartz_ore',
  'webmc:nether_gold_ore',
  'webmc:deepslate_coal_ore',
  'webmc:deepslate_diamond_ore',
  'webmc:deepslate_emerald_ore',
  'webmc:deepslate_lapis_ore',
  'webmc:deepslate_redstone_ore',
  'webmc:deepslate_copper_ore',
  'webmc:deepslate_iron_ore',
  'webmc:deepslate_gold_ore',
]);

export function isFortuneApplicable(blockId: string): boolean {
  return FORTUNEABLE_ORES.has(blockId);
}
