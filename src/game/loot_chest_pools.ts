export type ChestContext =
  | 'simple_dungeon'
  | 'abandoned_mineshaft'
  | 'village_weaponsmith'
  | 'nether_bridge'
  | 'stronghold_corridor'
  | 'stronghold_library'
  | 'buried_treasure'
  | 'shipwreck_treasure'
  | 'end_city_treasure'
  | 'bastion_treasure'
  | 'trial_chambers_reward';

const ROLLS: Record<ChestContext, { min: number; max: number }> = {
  simple_dungeon: { min: 3, max: 8 },
  abandoned_mineshaft: { min: 2, max: 4 },
  village_weaponsmith: { min: 3, max: 4 },
  nether_bridge: { min: 2, max: 4 },
  stronghold_corridor: { min: 2, max: 3 },
  stronghold_library: { min: 1, max: 4 },
  buried_treasure: { min: 1, max: 1 },
  shipwreck_treasure: { min: 3, max: 10 },
  end_city_treasure: { min: 2, max: 6 },
  bastion_treasure: { min: 1, max: 2 },
  trial_chambers_reward: { min: 3, max: 5 },
};

export function rollCount(ctx: ChestContext, rng: () => number): number {
  const r = ROLLS[ctx];
  return r.min + Math.floor(rng() * (r.max - r.min + 1));
}

export function hasEnchantedBook(ctx: ChestContext): boolean {
  return ctx === 'stronghold_library' || ctx === 'end_city_treasure';
}
