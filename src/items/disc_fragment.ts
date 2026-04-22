// Music disc fragment. 9 fragments craft 1 Disc 5 (and possibly other
// ancient-city-found discs in future updates). Drops from Ancient City
// ominous vaults.

import type { MusicDiscId } from '@/blocks/jukebox';

export interface FragmentState {
  discId: MusicDiscId;
  count: number;
}

const FRAGMENTS_PER_DISC = 9;

export function makeFragment(discId: MusicDiscId): FragmentState {
  return { discId, count: 1 };
}

export function addFragment(state: FragmentState, count = 1): boolean {
  if (count <= 0) return false;
  state.count += count;
  return true;
}

export interface AssembleResult {
  discId: MusicDiscId | null;
  leftover: number;
}

export function tryAssembleDisc(state: FragmentState): AssembleResult {
  if (state.count < FRAGMENTS_PER_DISC) {
    return { discId: null, leftover: state.count };
  }
  state.count -= FRAGMENTS_PER_DISC;
  return { discId: state.discId, leftover: state.count };
}
