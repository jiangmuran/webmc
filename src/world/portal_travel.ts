// Portal travel — the player stands inside a lit portal for 4 seconds and
// is teleported to the opposite dimension. In creative travel is instant.

import type { DimensionId } from './dimension';

export interface PortalTravelState {
  dimension: DimensionId;
  insidePortal: boolean;
  portalTicks: number;
  portalCooldownSec: number;
}

const PORTAL_TICKS_TO_TRAVEL = 80; // 4 seconds at 20 TPS
const COOLDOWN_SEC = 10;

export function makePortalTravel(dimension: DimensionId): PortalTravelState {
  return { dimension, insidePortal: false, portalTicks: 0, portalCooldownSec: 0 };
}

export interface PortalTickCtx {
  insidePortal: boolean;
  creative: boolean;
  dtSec: number;
}

export interface PortalTickResult {
  travel: boolean;
  targetDimension: DimensionId | null;
}

export function tickPortalTravel(state: PortalTravelState, ctx: PortalTickCtx): PortalTickResult {
  state.portalCooldownSec = Math.max(0, state.portalCooldownSec - ctx.dtSec);
  if (!ctx.insidePortal) {
    state.portalTicks = 0;
    state.insidePortal = false;
    return { travel: false, targetDimension: null };
  }
  state.insidePortal = true;
  if (state.portalCooldownSec > 0) return { travel: false, targetDimension: null };
  const ticksNeeded = ctx.creative ? 0 : PORTAL_TICKS_TO_TRAVEL;
  state.portalTicks += ctx.dtSec * 20;
  if (state.portalTicks >= ticksNeeded) {
    const target: DimensionId = state.dimension === 'overworld' ? 'nether' : 'overworld';
    state.portalCooldownSec = COOLDOWN_SEC;
    state.portalTicks = 0;
    state.dimension = target;
    return { travel: true, targetDimension: target };
  }
  return { travel: false, targetDimension: null };
}
