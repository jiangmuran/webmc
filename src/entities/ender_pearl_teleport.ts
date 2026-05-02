// Ender pearl. Thrown like snowball; on hit teleports the thrower to
// the landing position. Costs 5 HP fall damage (reducible by Protection
// and Feather Falling, but applies in all dimensions). Cooldown 1s.
//
// Wiki (minecraft.wiki/w/Ender_Pearl): "After it is thrown, the ender
// pearl is consumed, and the player teleports to where it lands,
// taking 5 hp fall damage. This will work even if the ender pearl
// lands in another dimension."
// Old onPearlLand exempted End-dimension landings from damage; that's
// nowhere in the wiki. Damage applies uniformly across dimensions.

export interface PearlState {
  lastUsedMs: number;
}

export const COOLDOWN_MS = 1000;
export const TELEPORT_DAMAGE = 5;

export function makeState(): PearlState {
  return { lastUsedMs: -Infinity };
}

export interface ThrowQuery {
  nowMs: number;
  inCreative: boolean;
  inEnd: boolean;
  mountedOnEntity: boolean;
}

export type ThrowResult =
  | { ok: true; refundPearl: boolean }
  | { ok: false; reason: 'cooldown' | 'mounted' };

export function tryThrow(s: PearlState, q: ThrowQuery): ThrowResult {
  if (q.mountedOnEntity) return { ok: false, reason: 'mounted' };
  if (q.nowMs - s.lastUsedMs < COOLDOWN_MS) return { ok: false, reason: 'cooldown' };
  s.lastUsedMs = q.nowMs;
  // Pearls kept in creative; used otherwise.
  return { ok: true, refundPearl: q.inCreative };
}

export interface LandQuery {
  inEnd: boolean;
  hitValid: boolean;
}

export interface LandResult {
  teleport: boolean;
  damageToThrower: number;
}

export function onPearlLand(q: LandQuery): LandResult {
  if (!q.hitValid) return { teleport: false, damageToThrower: 0 };
  return {
    teleport: true,
    damageToThrower: TELEPORT_DAMAGE,
  };
}
