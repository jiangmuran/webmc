const MAX_LEVELS: Record<string, number> = {
  sharpness: 5,
  smite: 5,
  bane_of_arthropods: 5,
  knockback: 2,
  looting: 3,
  sweeping_edge: 3,
  fire_aspect: 2,
  efficiency: 5,
  fortune: 3,
  silk_touch: 1,
  unbreaking: 3,
  mending: 1,
  power: 5,
  punch: 2,
  flame: 1,
  infinity: 1,
  multishot: 1,
  piercing: 4,
  quick_charge: 3,
  loyalty: 3,
  riptide: 3,
  impaling: 5,
  channeling: 1,
  density: 5,
  breach: 4,
  wind_burst: 3,
  protection: 4,
  blast_protection: 4,
  fire_protection: 4,
  projectile_protection: 4,
  thorns: 3,
  respiration: 3,
  aqua_affinity: 1,
  feather_falling: 4,
  depth_strider: 3,
  frost_walker: 2,
  soul_speed: 3,
  swift_sneak: 3,
  curse_of_binding: 1,
  curse_of_vanishing: 1,
  luck_of_the_sea: 3,
  lure: 3,
};

export function maxLevel(id: string): number | undefined {
  return MAX_LEVELS[id];
}

export function isTreasure(id: string): boolean {
  return (
    id === 'mending' ||
    id === 'curse_of_binding' ||
    id === 'curse_of_vanishing' ||
    id === 'frost_walker' ||
    id === 'soul_speed' ||
    id === 'swift_sneak'
  );
}
