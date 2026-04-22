// Trader llamas. Leashed to a wandering trader; spit at hostile mobs
// nearby when the trader is threatened. Inherit trader despawn.

export interface TraderLlama {
  leashedToTraderId: string | null;
  despawnTimerMs: number;
  lastSpitMs: number;
}

export const SPIT_COOLDOWN_MS = 1500;
export const SPIT_DAMAGE = 2;
export const DEFEND_RANGE = 16;

export function makeTraderLlama(traderId: string): TraderLlama {
  return { leashedToTraderId: traderId, despawnTimerMs: 0, lastSpitMs: -Infinity };
}

export interface SpitQuery {
  nowMs: number;
  hostileNear: { id: string; distance: number } | null;
  traderThreatened: boolean;
}

export function trySpit(l: TraderLlama, q: SpitQuery): string | null {
  if (!q.hostileNear) return null;
  if (!q.traderThreatened) return null;
  if (q.hostileNear.distance > DEFEND_RANGE) return null;
  if (q.nowMs - l.lastSpitMs < SPIT_COOLDOWN_MS) return null;
  l.lastSpitMs = q.nowMs;
  return q.hostileNear.id;
}

// If the trader despawns or dies, the llama is released and keeps its caravan order.
export function release(l: TraderLlama): void {
  l.leashedToTraderId = null;
}
