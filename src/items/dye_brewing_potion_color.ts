export type PotionKind =
  | 'water'
  | 'awkward'
  | 'regeneration'
  | 'strength'
  | 'swiftness'
  | 'slowness'
  | 'poison'
  | 'instant_health'
  | 'instant_damage'
  | 'night_vision'
  | 'fire_resistance'
  | 'water_breathing'
  | 'invisibility'
  | 'leaping'
  | 'weakness';

const COLORS: Record<PotionKind, [number, number, number]> = {
  water: [55, 91, 191],
  awkward: [55, 91, 191],
  regeneration: [205, 92, 171],
  strength: [147, 36, 35],
  swiftness: [124, 175, 198],
  slowness: [91, 110, 128],
  poison: [78, 147, 49],
  instant_health: [249, 36, 73],
  instant_damage: [67, 10, 9],
  night_vision: [31, 31, 161],
  fire_resistance: [228, 154, 58],
  water_breathing: [46, 82, 153],
  invisibility: [127, 131, 146],
  leaping: [34, 255, 76],
  weakness: [72, 77, 72],
};

export function colorOf(p: PotionKind): [number, number, number] {
  return COLORS[p];
}
