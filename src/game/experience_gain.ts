// Experience-orb drop table. Mobs drop XP on player kill; ores drop XP
// on player mine; smelt/brew operations award XP on result pickup.

export type XpSource =
  | { kind: 'mob'; mob: string }
  | { kind: 'breed_baby' }
  | { kind: 'ore'; ore: string }
  | { kind: 'smelt'; smelting: string }
  | { kind: 'trade' }
  | { kind: 'bottle_throw' }
  | { kind: 'fish' };

const MOB_XP: Record<string, [number, number]> = {
  zombie: [5, 5],
  skeleton: [5, 5],
  creeper: [5, 5],
  spider: [5, 5],
  enderman: [5, 5],
  witch: [5, 5],
  piglin: [5, 5],
  hoglin: [5, 5],
  ghast: [5, 5],
  blaze: [10, 10],
  wither_skeleton: [10, 10],
  guardian: [10, 10],
  elder_guardian: [10, 10],
  warden: [5, 5],
  wither: [50, 50],
  ender_dragon: [12_000, 12_000],
  evoker: [10, 10],
  vindicator: [5, 5],
  ravager: [20, 20],
  pillager: [5, 5],
  shulker: [5, 5],
  breeze: [10, 10],
  // Vanilla XP for hostiles that webmc spawns but the table missed —
  // husk / stray / drowned / bogged / zombie_villager / cave_spider /
  // silverfish / phantom / magma_cube / slime / piglin_brute /
  // zombified_piglin / vex / zoglin all drop XP per vanilla.
  husk: [5, 5],
  stray: [5, 5],
  drowned: [5, 5],
  bogged: [5, 5],
  zombie_villager: [5, 5],
  cave_spider: [5, 5],
  silverfish: [5, 5],
  phantom: [5, 5],
  magma_cube: [4, 4],
  slime: [4, 4],
  piglin_brute: [20, 20],
  zombified_piglin: [5, 5],
  vex: [3, 3],
  zoglin: [5, 5],
};

const ORE_XP: Record<string, [number, number]> = {
  coal_ore: [0, 2],
  iron_ore: [0, 0], // iron ore drops raw iron, no XP
  gold_ore: [0, 0],
  nether_gold_ore: [0, 1],
  diamond_ore: [3, 7],
  emerald_ore: [3, 7],
  lapis_ore: [2, 5],
  nether_quartz_ore: [2, 5],
  redstone_ore: [1, 5],
  copper_ore: [0, 0],
  ancient_debris: [0, 0],
  sculk: [1, 1],
};

const SMELT_XP: Record<string, number> = {
  iron_ingot: 0.7,
  gold_ingot: 1.0,
  diamond: 1.0,
  emerald: 1.0,
  copper_ingot: 0.7,
  nether_brick: 0.1,
  baked_potato: 0.35,
  cooked_beef: 0.35,
  cooked_chicken: 0.35,
  cooked_porkchop: 0.35,
  cooked_cod: 0.35,
  cooked_salmon: 0.35,
  cooked_mutton: 0.35,
  cooked_rabbit: 0.35,
  bread: 0,
  glass: 0.1,
  charcoal: 0.15,
};

export interface XpRollQuery {
  source: XpSource;
  rng: () => number;
}

export function rollXp(q: XpRollQuery): number {
  switch (q.source.kind) {
    case 'mob': {
      const range = MOB_XP[q.source.mob] ?? [0, 0];
      return range[0] + Math.floor(q.rng() * (range[1] - range[0] + 1));
    }
    case 'breed_baby':
      return 1 + Math.floor(q.rng() * 7); // 1..7
    case 'ore': {
      const range = ORE_XP[q.source.ore] ?? [0, 0];
      return range[0] + Math.floor(q.rng() * (range[1] - range[0] + 1));
    }
    case 'smelt':
      return SMELT_XP[q.source.smelting] ?? 0;
    case 'trade':
      return 3 + Math.floor(q.rng() * 4); // 3..6
    case 'bottle_throw':
      return 3 + Math.floor(q.rng() * 9); // 3..11
    case 'fish':
      return 1 + Math.floor(q.rng() * 6); // 1..6
  }
}

// Allocation-free variant for the dominant mob-kill case. Skips the
// {source: {kind: 'mob', mob}, rng} literals that rollXp's callers
// were building per kill (chained sweeping-edge attacks fire many
// rollMobXp's per tick).
export function rollMobXpFor(mob: string, rng: () => number): number {
  const range = MOB_XP[mob] ?? [0, 0];
  return range[0] + Math.floor(rng() * (range[1] - range[0] + 1));
}

export function mobXpRange(mob: string): [number, number] {
  return MOB_XP[mob] ?? [0, 0];
}

export function oreXpRange(ore: string): [number, number] {
  return ORE_XP[ore] ?? [0, 0];
}
