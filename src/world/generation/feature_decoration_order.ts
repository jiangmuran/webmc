export type Feature =
  | 'caves'
  | 'canyons'
  | 'lakes'
  | 'ore_dirt'
  | 'ore_gravel'
  | 'ore_granite'
  | 'ore_diorite'
  | 'ore_andesite'
  | 'ore_coal'
  | 'ore_iron'
  | 'ore_gold'
  | 'ore_redstone'
  | 'ore_diamond'
  | 'ore_lapis'
  | 'ore_copper'
  | 'ore_emerald'
  | 'dungeons'
  | 'mineshafts'
  | 'strongholds'
  | 'structures'
  | 'water_plants'
  | 'seagrass'
  | 'vegetation'
  | 'trees'
  | 'grass_flowers'
  | 'mushrooms'
  | 'snow'
  | 'ice'
  | 'top_decoration';

export const GEN_ORDER: readonly Feature[] = [
  'caves',
  'canyons',
  'lakes',
  'ore_dirt',
  'ore_gravel',
  'ore_granite',
  'ore_diorite',
  'ore_andesite',
  'ore_coal',
  'ore_iron',
  'ore_gold',
  'ore_redstone',
  'ore_diamond',
  'ore_lapis',
  'ore_copper',
  'ore_emerald',
  'dungeons',
  'mineshafts',
  'strongholds',
  'structures',
  'water_plants',
  'seagrass',
  'vegetation',
  'trees',
  'grass_flowers',
  'mushrooms',
  'snow',
  'ice',
  'top_decoration',
];

export function stepOrder(feature: Feature): number {
  return GEN_ORDER.indexOf(feature);
}

export function runsBefore(a: Feature, b: Feature): boolean {
  return stepOrder(a) < stepOrder(b);
}
