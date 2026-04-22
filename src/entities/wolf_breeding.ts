// Wolf breeding + inheritance. Two tamed wolves fed meat enter "love
// mode" for 30s; if they meet while both in love mode, a puppy spawns
// with:
//   - owner = either parent's owner
//   - variant = randomly inherited from either parent
//   - collar color = inherits from a random parent (mutation 1/20)
// The puppy follows the parent's owner immediately.

import type { WolfVariant } from './wolf_variants';

export interface WolfBreedingState {
  tamed: boolean;
  ownerId: string | null;
  variant: WolfVariant;
  collarColor: string;
  inLoveModeUntilSec: number;
}

const LOVE_MODE_DURATION_SEC = 30;
const COLLAR_MUTATION_CHANCE = 1 / 20;

export function makeWolfBreeding(
  tamed: boolean,
  ownerId: string | null,
  variant: WolfVariant,
  collarColor = 'red',
): WolfBreedingState {
  return {
    tamed,
    ownerId,
    variant,
    collarColor,
    inLoveModeUntilSec: 0,
  };
}

export function feedMeat(state: WolfBreedingState, nowSec: number, fullHealth: boolean): boolean {
  if (!state.tamed) return false;
  if (!fullHealth) return false;
  state.inLoveModeUntilSec = nowSec + LOVE_MODE_DURATION_SEC;
  return true;
}

export function inLoveMode(state: WolfBreedingState, nowSec: number): boolean {
  return state.inLoveModeUntilSec > nowSec;
}

export interface BreedQuery {
  a: WolfBreedingState;
  b: WolfBreedingState;
  nowSec: number;
  rng: () => number;
}

export interface WolfPuppy {
  ownerId: string | null;
  variant: WolfVariant;
  collarColor: string;
}

export function tryBreed(q: BreedQuery): WolfPuppy | null {
  if (!inLoveMode(q.a, q.nowSec) || !inLoveMode(q.b, q.nowSec)) return null;
  q.a.inLoveModeUntilSec = 0;
  q.b.inLoveModeUntilSec = 0;
  const owner = q.rng() < 0.5 ? q.a.ownerId : q.b.ownerId;
  const variant: WolfVariant = q.rng() < 0.5 ? q.a.variant : q.b.variant;
  const mutate = q.rng() < COLLAR_MUTATION_CHANCE;
  const collar = mutate
    ? randomCollarColor(q.rng())
    : q.rng() < 0.5
      ? q.a.collarColor
      : q.b.collarColor;
  return { ownerId: owner, variant, collarColor: collar };
}

const COLLAR_COLORS = ['white', 'orange', 'yellow', 'lime', 'red', 'blue', 'purple', 'black'];

function randomCollarColor(roll: number): string {
  return COLLAR_COLORS[Math.floor(roll * COLLAR_COLORS.length)] ?? 'red';
}
