// Status effect registry. Each effect has a category (beneficial / neutral
// / harmful), a color (potion bottle tint), and a per-tick handler that
// modifies entity stats. Handlers are pure — they return the stat deltas
// to apply, not the mutated entity.

export type EffectCategory = 'beneficial' | 'neutral' | 'harmful';

export interface EffectDef {
  id: string;
  category: EffectCategory;
  color: [number, number, number];
  icon: string;
  instant: boolean;
}

export const EFFECTS: Record<string, EffectDef> = {
  speed: {
    id: 'speed',
    category: 'beneficial',
    color: [124, 175, 198],
    icon: 'speed',
    instant: false,
  },
  slowness: {
    id: 'slowness',
    category: 'harmful',
    color: [90, 108, 129],
    icon: 'slowness',
    instant: false,
  },
  haste: {
    id: 'haste',
    category: 'beneficial',
    color: [217, 192, 67],
    icon: 'haste',
    instant: false,
  },
  mining_fatigue: {
    id: 'mining_fatigue',
    category: 'harmful',
    color: [74, 66, 23],
    icon: 'mining_fatigue',
    instant: false,
  },
  strength: {
    id: 'strength',
    category: 'beneficial',
    color: [147, 36, 36],
    icon: 'strength',
    instant: false,
  },
  instant_health: {
    id: 'instant_health',
    category: 'beneficial',
    color: [248, 36, 35],
    icon: 'instant_health',
    instant: true,
  },
  instant_damage: {
    id: 'instant_damage',
    category: 'harmful',
    color: [67, 10, 9],
    icon: 'instant_damage',
    instant: true,
  },
  jump_boost: {
    id: 'jump_boost',
    category: 'beneficial',
    color: [34, 255, 76],
    icon: 'jump_boost',
    instant: false,
  },
  nausea: {
    id: 'nausea',
    category: 'harmful',
    color: [85, 29, 74],
    icon: 'nausea',
    instant: false,
  },
  regeneration: {
    id: 'regeneration',
    category: 'beneficial',
    color: [205, 92, 171],
    icon: 'regeneration',
    instant: false,
  },
  resistance: {
    id: 'resistance',
    category: 'beneficial',
    color: [153, 69, 58],
    icon: 'resistance',
    instant: false,
  },
  fire_resistance: {
    id: 'fire_resistance',
    category: 'beneficial',
    color: [228, 154, 58],
    icon: 'fire_resistance',
    instant: false,
  },
  water_breathing: {
    id: 'water_breathing',
    category: 'beneficial',
    color: [46, 82, 153],
    icon: 'water_breathing',
    instant: false,
  },
  invisibility: {
    id: 'invisibility',
    category: 'beneficial',
    color: [127, 131, 146],
    icon: 'invisibility',
    instant: false,
  },
  blindness: {
    id: 'blindness',
    category: 'harmful',
    color: [31, 31, 35],
    icon: 'blindness',
    instant: false,
  },
  night_vision: {
    id: 'night_vision',
    category: 'beneficial',
    color: [31, 31, 161],
    icon: 'night_vision',
    instant: false,
  },
  hunger: {
    id: 'hunger',
    category: 'harmful',
    color: [88, 118, 51],
    icon: 'hunger',
    instant: false,
  },
  weakness: {
    id: 'weakness',
    category: 'harmful',
    color: [72, 77, 72],
    icon: 'weakness',
    instant: false,
  },
  poison: {
    id: 'poison',
    category: 'harmful',
    color: [75, 147, 28],
    icon: 'poison',
    instant: false,
  },
  wither: {
    id: 'wither',
    category: 'harmful',
    color: [53, 42, 39],
    icon: 'wither',
    instant: false,
  },
  health_boost: {
    id: 'health_boost',
    category: 'beneficial',
    color: [248, 125, 35],
    icon: 'health_boost',
    instant: false,
  },
  absorption: {
    id: 'absorption',
    category: 'beneficial',
    color: [36, 107, 251],
    icon: 'absorption',
    instant: false,
  },
  saturation: {
    id: 'saturation',
    category: 'beneficial',
    color: [248, 72, 1],
    icon: 'saturation',
    instant: true,
  },
  glowing: {
    id: 'glowing',
    category: 'neutral',
    color: [148, 164, 148],
    icon: 'glowing',
    instant: false,
  },
  levitation: {
    id: 'levitation',
    category: 'harmful',
    color: [206, 255, 255],
    icon: 'levitation',
    instant: false,
  },
  luck: { id: 'luck', category: 'beneficial', color: [51, 153, 51], icon: 'luck', instant: false },
  unluck: {
    id: 'unluck',
    category: 'harmful',
    color: [192, 160, 134],
    icon: 'unluck',
    instant: false,
  },
  slow_falling: {
    id: 'slow_falling',
    category: 'beneficial',
    color: [247, 247, 247],
    icon: 'slow_falling',
    instant: false,
  },
  conduit_power: {
    id: 'conduit_power',
    category: 'beneficial',
    color: [29, 199, 185],
    icon: 'conduit_power',
    instant: false,
  },
  dolphins_grace: {
    id: 'dolphins_grace',
    category: 'beneficial',
    color: [136, 166, 191],
    icon: 'dolphins_grace',
    instant: false,
  },
  bad_omen: {
    id: 'bad_omen',
    category: 'neutral',
    color: [11, 102, 36],
    icon: 'bad_omen',
    instant: false,
  },
  hero_of_the_village: {
    id: 'hero_of_the_village',
    category: 'beneficial',
    color: [68, 255, 68],
    icon: 'hero_of_the_village',
    instant: false,
  },
  darkness: {
    id: 'darkness',
    category: 'harmful',
    color: [41, 39, 33],
    icon: 'darkness',
    instant: false,
  },
  trial_omen: {
    id: 'trial_omen',
    category: 'neutral',
    color: [22, 166, 202],
    icon: 'trial_omen',
    instant: false,
  },
  raid_omen: {
    id: 'raid_omen',
    category: 'neutral',
    color: [117, 12, 0],
    icon: 'raid_omen',
    instant: false,
  },
  wind_charged: {
    id: 'wind_charged',
    category: 'harmful',
    color: [204, 204, 251],
    icon: 'wind_charged',
    instant: false,
  },
  weaving: {
    id: 'weaving',
    category: 'harmful',
    color: [119, 99, 98],
    icon: 'weaving',
    instant: false,
  },
  oozing: {
    id: 'oozing',
    category: 'harmful',
    color: [148, 189, 68],
    icon: 'oozing',
    instant: false,
  },
  infested: {
    id: 'infested',
    category: 'harmful',
    color: [73, 122, 106],
    icon: 'infested',
    instant: false,
  },
};

export function defOf(effectId: string): EffectDef | null {
  return EFFECTS[effectId] ?? null;
}

export function isBeneficial(effectId: string): boolean {
  return EFFECTS[effectId]?.category === 'beneficial';
}

export function isHarmful(effectId: string): boolean {
  return EFFECTS[effectId]?.category === 'harmful';
}

// Milk bucket clears every effect except "instant_*" which already resolved.
export function milkClearable(effectId: string): boolean {
  return !(EFFECTS[effectId]?.instant ?? false);
}

// Resolve two stacking effects: pick higher amplifier, sum duration up to
// a cap. Matches MC behavior when drinking two potions of the same kind.
export interface EffectStack {
  amplifier: number;
  durationSec: number;
}

export function stackEffects(a: EffectStack, b: EffectStack): EffectStack {
  if (a.amplifier > b.amplifier) return a;
  if (b.amplifier > a.amplifier) return b;
  return { amplifier: a.amplifier, durationSec: Math.max(a.durationSec, b.durationSec) };
}
