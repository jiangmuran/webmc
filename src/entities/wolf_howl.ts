// Wolf howl on owner death. When a wolf's owner dies within earshot,
// the wolf howls + becomes hostile to the killer.

export interface WolfHowlState {
  ownerId: number | null;
  hostileToId: number | null;
  howlingSec: number;
}

export function makeWolfHowlState(ownerId: number | null = null): WolfHowlState {
  return { ownerId, hostileToId: null, howlingSec: 0 };
}

export interface OwnerDeathCtx {
  deadOwnerId: number;
  killerId: number | null;
  distanceToOwner: number;
}

export function onOwnerDeath(state: WolfHowlState, ctx: OwnerDeathCtx): boolean {
  if (state.ownerId !== ctx.deadOwnerId) return false;
  if (ctx.distanceToOwner > 20) return false;
  state.howlingSec = 3;
  if (ctx.killerId !== null) state.hostileToId = ctx.killerId;
  return true;
}

export function tickWolf(state: WolfHowlState, dtSec: number): void {
  state.howlingSec = Math.max(0, state.howlingSec - dtSec);
}
