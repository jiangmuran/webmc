// Campfire ignition. A campfire block can be extinguished (no smoke,
// no cooking, no light) or lit. Flint-and-steel or fire charge lights
// it; water/shovel extinguishes it; a waterlog state also extinguishes.
// Campfires light on placement by default.

import type { CampfireKind } from './campfire_smoke';

export interface CampfireLitState {
  kind: CampfireKind;
  lit: boolean;
  waterlogged: boolean;
}

export function makeCampfireLit(kind: CampfireKind): CampfireLitState {
  return { kind, lit: true, waterlogged: false };
}

export type IgnitionTool = 'flint_and_steel' | 'fire_charge' | 'lightning' | 'none';

export interface IgniteQuery {
  state: CampfireLitState;
  tool: IgnitionTool;
}

export interface IgniteResult {
  lit: boolean;
  consumedDurability: boolean;
  consumedItem: boolean;
}

export function ignite(q: IgniteQuery): IgniteResult {
  if (q.state.lit || q.state.waterlogged) {
    return { lit: q.state.lit, consumedDurability: false, consumedItem: false };
  }
  q.state.lit = true;
  return {
    lit: true,
    consumedDurability: q.tool === 'flint_and_steel',
    consumedItem: q.tool === 'fire_charge',
  };
}

// Extinguishing: water bucket, waterlog interaction, or shovel.
export type ExtinguishAction = 'water_bucket' | 'shovel' | 'waterlog' | 'none';

export function extinguish(state: CampfireLitState, action: ExtinguishAction): boolean {
  if (!state.lit && !state.waterlogged) return false;
  if (action === 'shovel' || action === 'water_bucket') {
    state.lit = false;
    return true;
  }
  if (action === 'waterlog') {
    state.lit = false;
    state.waterlogged = true;
    return true;
  }
  return false;
}

// Soul campfire damage (double of normal) is modeled elsewhere; this
// module just controls ignition state.
export function isProducingSmoke(state: CampfireLitState): boolean {
  return state.lit && !state.waterlogged;
}
