// Decorated pot. Crafted with 4 pottery sherds (or bricks) that decorate
// its 4 faces. Since 1.20.5, pots accept a single stack of items as a
// one-slot container.

import type { ItemStack } from '@/items/item';

export type PotFace = 'north' | 'south' | 'east' | 'west';

export type PotSherd =
  | 'blank'
  | 'brick'
  | 'angler_pottery_sherd'
  | 'archer_pottery_sherd'
  | 'arms_up_pottery_sherd'
  | 'blade_pottery_sherd'
  | 'brewer_pottery_sherd'
  | 'burn_pottery_sherd'
  | 'danger_pottery_sherd'
  | 'explorer_pottery_sherd'
  | 'flow_pottery_sherd'
  | 'friend_pottery_sherd'
  | 'guster_pottery_sherd'
  | 'heart_pottery_sherd'
  | 'heartbreak_pottery_sherd'
  | 'howl_pottery_sherd'
  | 'miner_pottery_sherd'
  | 'mourner_pottery_sherd'
  | 'plenty_pottery_sherd'
  | 'prize_pottery_sherd'
  | 'scrape_pottery_sherd'
  | 'sheaf_pottery_sherd'
  | 'shelter_pottery_sherd'
  | 'skull_pottery_sherd'
  | 'snort_pottery_sherd';

export interface DecoratedPotState {
  faces: Record<PotFace, PotSherd>;
  contents: ItemStack | null;
}

export function makeDecoratedPot(
  faces: Partial<Record<PotFace, PotSherd>> = {},
): DecoratedPotState {
  return {
    faces: {
      north: faces.north ?? 'blank',
      south: faces.south ?? 'blank',
      east: faces.east ?? 'blank',
      west: faces.west ?? 'blank',
    },
    contents: null,
  };
}

export function insertIntoPot(state: DecoratedPotState, stack: ItemStack): ItemStack | null {
  if (state.contents) {
    if (state.contents.itemId === stack.itemId && state.contents.damage === stack.damage) {
      state.contents = { ...state.contents, count: state.contents.count + stack.count };
      return null;
    }
    return stack;
  }
  state.contents = { ...stack };
  return null;
}

export function takeFromPot(state: DecoratedPotState): ItemStack | null {
  const out = state.contents;
  state.contents = null;
  return out;
}

export function hasSherd(state: DecoratedPotState, sherd: PotSherd): boolean {
  return (
    state.faces.north === sherd ||
    state.faces.south === sherd ||
    state.faces.east === sherd ||
    state.faces.west === sherd
  );
}
