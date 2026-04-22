// Mooshroom interactions. Right-click with bowl → mushroom stew.
// Shear → drops 5 mushrooms + transforms to cow. Brown mooshroom
// appears when struck by lightning.

export type MooshroomType = 'red' | 'brown';

export interface Mooshroom {
  variant: MooshroomType;
  shorn: boolean;
}

export function makeMooshroom(variant: MooshroomType = 'red'): Mooshroom {
  return { variant, shorn: false };
}

export function milkStew(m: Mooshroom): 'webmc:mushroom_stew' | 'webmc:suspicious_stew' {
  return m.variant === 'brown' ? 'webmc:suspicious_stew' : 'webmc:mushroom_stew';
}

export interface ShearResult {
  dropped: { id: string; count: number };
  transformedTo: 'webmc:cow';
}

export function shear(m: Mooshroom): ShearResult | null {
  if (m.shorn) return null;
  m.shorn = true;
  const mushroomId = m.variant === 'red' ? 'webmc:red_mushroom' : 'webmc:brown_mushroom';
  return {
    dropped: { id: mushroomId, count: 5 },
    transformedTo: 'webmc:cow',
  };
}

// Lightning: red ↔ brown flip.
export function onLightning(m: Mooshroom): void {
  m.variant = m.variant === 'red' ? 'brown' : 'red';
}

// Brown mooshroom fed a small flower → its next stew carries that
// flower's status effect.
const FLOWER_EFFECT: Record<string, string> = {
  'webmc:dandelion': 'saturation',
  'webmc:poppy': 'night_vision',
  'webmc:blue_orchid': 'saturation',
  'webmc:allium': 'fire_resistance',
  'webmc:azure_bluet': 'blindness',
  'webmc:red_tulip': 'weakness',
  'webmc:orange_tulip': 'weakness',
  'webmc:white_tulip': 'weakness',
  'webmc:pink_tulip': 'weakness',
  'webmc:oxeye_daisy': 'regeneration',
  'webmc:cornflower': 'jump_boost',
  'webmc:lily_of_the_valley': 'poison',
  'webmc:wither_rose': 'wither',
};

export function flowerEffect(flowerId: string): string | null {
  return FLOWER_EFFECT[flowerId] ?? null;
}
