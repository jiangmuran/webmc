// Minecart variants. Extends the plain minecart with: chest, hopper,
// furnace, tnt, command. Each carries state + responds to pickup / ride /
// redstone differently.

import type { Container } from '@/items/container';
import { makeContainer } from '@/items/container';

export type MinecartVariant = 'plain' | 'chest' | 'hopper' | 'furnace' | 'tnt' | 'command';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface MinecartVariantState {
  variant: MinecartVariant;
  container: Container | null;
  furnaceFuelSec: number;
  tntFuseSec: number;
  commandText: string;
}

export function makeVariantMinecart(
  variant: MinecartVariant,
  maxStack: (itemId: number) => number = () => 64,
): MinecartVariantState {
  const state: MinecartVariantState = {
    variant,
    container: null,
    furnaceFuelSec: 0,
    tntFuseSec: 0,
    commandText: '',
  };
  if (variant === 'chest') state.container = makeContainer(27, maxStack);
  if (variant === 'hopper') state.container = makeContainer(5, maxStack);
  return state;
}

// Furnace minecart: fuel lasts 4 minutes per coal, pushes itself forward.
const FURNACE_FUEL_PER_COAL_SEC = 240;
export function feedFurnaceMinecart(state: MinecartVariantState): boolean {
  if (state.variant !== 'furnace') return false;
  state.furnaceFuelSec += FURNACE_FUEL_PER_COAL_SEC;
  return true;
}

export function tickFurnaceMinecart(state: MinecartVariantState, dtSec: number): boolean {
  if (state.variant !== 'furnace') return false;
  state.furnaceFuelSec = Math.max(0, state.furnaceFuelSec - dtSec);
  return state.furnaceFuelSec > 0;
}

// TNT minecart: activator rail or fall damage starts the 4s fuse; ticks
// detonate on timeout.
export function igniteTntMinecart(state: MinecartVariantState): boolean {
  if (state.variant !== 'tnt') return false;
  if (state.tntFuseSec > 0) return false;
  state.tntFuseSec = 4;
  return true;
}

export function tickTntMinecart(state: MinecartVariantState, dtSec: number): boolean {
  if (state.variant !== 'tnt' || state.tntFuseSec <= 0) return false;
  state.tntFuseSec = Math.max(0, state.tntFuseSec - dtSec);
  return state.tntFuseSec === 0;
}
