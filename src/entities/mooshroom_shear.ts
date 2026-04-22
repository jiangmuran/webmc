// Mooshroom shear + soup + flower interactions.
//   - Shearing a mooshroom turns it back to a regular cow and drops 5
//     mushrooms of its color (red or brown).
//   - Using a bowl on the mooshroom produces a mushroom stew.
//   - Using a flower on a brown mooshroom produces a suspicious stew
//     with the flower's effect.

export type MooshroomColor = 'red' | 'brown';

export interface MooshroomState {
  color: MooshroomColor;
  sheared: boolean;
  suspiciousFlowerEffect: { effect: string; durationSec: number } | null;
}

export function makeMooshroom(color: MooshroomColor): MooshroomState {
  return { color, sheared: false, suspiciousFlowerEffect: null };
}

export interface ShearResult {
  becameCow: boolean;
  drops: { item: string; count: number }[];
}

export function shear(state: MooshroomState): ShearResult {
  if (state.sheared) return { becameCow: false, drops: [] };
  state.sheared = true;
  const mushroom = state.color === 'red' ? 'webmc:red_mushroom' : 'webmc:brown_mushroom';
  return {
    becameCow: true,
    drops: [{ item: mushroom, count: 5 }],
  };
}

export interface StewResult {
  stew: { item: string; effect: { id: string; durationSec: number } | null } | null;
}

export function bowlInteract(state: MooshroomState): StewResult {
  if (state.sheared) return { stew: null };
  if (state.suspiciousFlowerEffect) {
    const eff = state.suspiciousFlowerEffect;
    state.suspiciousFlowerEffect = null;
    return {
      stew: {
        item: 'webmc:suspicious_stew',
        effect: { id: eff.effect, durationSec: eff.durationSec },
      },
    };
  }
  return { stew: { item: 'webmc:mushroom_stew', effect: null } };
}

const FLOWER_EFFECTS: Record<string, { effect: string; durationSec: number }> = {
  'webmc:dandelion': { effect: 'saturation', durationSec: 7 },
  'webmc:poppy': { effect: 'night_vision', durationSec: 5 },
  'webmc:blue_orchid': { effect: 'saturation', durationSec: 7 },
  'webmc:allium': { effect: 'fire_resistance', durationSec: 4 },
  'webmc:azure_bluet': { effect: 'blindness', durationSec: 8 },
  'webmc:red_tulip': { effect: 'weakness', durationSec: 9 },
  'webmc:orange_tulip': { effect: 'weakness', durationSec: 9 },
  'webmc:white_tulip': { effect: 'weakness', durationSec: 9 },
  'webmc:pink_tulip': { effect: 'weakness', durationSec: 9 },
  'webmc:oxeye_daisy': { effect: 'regeneration', durationSec: 8 },
  'webmc:cornflower': { effect: 'jump_boost', durationSec: 6 },
  'webmc:lily_of_the_valley': { effect: 'poison', durationSec: 12 },
  'webmc:wither_rose': { effect: 'wither', durationSec: 8 },
  'webmc:torchflower': { effect: 'night_vision', durationSec: 5 },
};

export interface FlowerFeedResult {
  accepted: boolean;
  reason?: 'wrong_color' | 'already_loaded';
}

export function feedFlowerToBrown(state: MooshroomState, flower: string): FlowerFeedResult {
  if (state.color !== 'brown') return { accepted: false, reason: 'wrong_color' };
  if (state.suspiciousFlowerEffect !== null) return { accepted: false, reason: 'already_loaded' };
  const eff = FLOWER_EFFECTS[flower];
  if (!eff) return { accepted: false, reason: 'wrong_color' };
  state.suspiciousFlowerEffect = { ...eff };
  return { accepted: true };
}
