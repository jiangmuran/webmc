// Zombified piglin. Neutral by default; attacking one aggroes all
// within 67 blocks. Anger cools down after 20-40 seconds.
//
// Wiki (minecraft.wiki/w/Zombified_Piglin): the Java forgiveness
// timer "ranges from 20 seconds to 55 seconds", with the base
// 20-40 s applying when the player is out of follow range plus an
// extra 15 s if out of sight but in range. webmc doesn't model the
// sight/range distinction, so we use the base 20-40 s window. Old
// 25-39 s was off on both ends and inside the wiki range.

export interface ZPiglinAnger {
  angryAtPlayerId: string | null;
  angerEndMs: number;
}

export const AGGRO_RADIUS = 67;
export const ANGER_MIN_MS = 20_000;
export const ANGER_MAX_MS = 40_000;

export function makeAnger(): ZPiglinAnger {
  return { angryAtPlayerId: null, angerEndMs: 0 };
}

export function provoke(
  z: ZPiglinAnger,
  playerId: string,
  nowMs: number,
  rand: () => number,
): void {
  z.angryAtPlayerId = playerId;
  const dur = ANGER_MIN_MS + rand() * (ANGER_MAX_MS - ANGER_MIN_MS);
  z.angerEndMs = nowMs + dur;
}

export function isHostile(z: ZPiglinAnger, playerId: string, nowMs: number): boolean {
  if (z.angryAtPlayerId !== playerId) return false;
  return nowMs < z.angerEndMs;
}

// Nearby zombified piglins share anger within AGGRO_RADIUS.
export interface AggroPropagation {
  mobPos: { x: number; y: number; z: number };
  provokedPos: { x: number; y: number; z: number };
}

export function shouldShareAnger(q: AggroPropagation): boolean {
  const dx = q.mobPos.x - q.provokedPos.x;
  const dy = q.mobPos.y - q.provokedPos.y;
  const dz = q.mobPos.z - q.provokedPos.z;
  return dx * dx + dy * dy + dz * dz <= AGGRO_RADIUS * AGGRO_RADIUS;
}
