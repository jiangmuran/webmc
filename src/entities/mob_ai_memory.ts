// Mob AI memory. A small key-value store with expiration, used by
// behavior trees for short-term context (last-seen target, last
// aggression from player, fled-from point). Memories auto-expire.

export interface MemoryEntry<T = unknown> {
  value: T;
  expiresAtSec: number;
}

export class MobMemory {
  private readonly entries = new Map<string, MemoryEntry>();

  set(key: string, value: unknown, ttlSec: number, nowSec: number): void {
    this.entries.set(key, { value, expiresAtSec: nowSec + ttlSec });
  }

  get(key: string, nowSec: number): unknown {
    const e = this.entries.get(key);
    if (!e) return null;
    if (nowSec >= e.expiresAtSec) {
      this.entries.delete(key);
      return null;
    }
    return e.value;
  }

  has(key: string, nowSec: number): boolean {
    return this.get(key, nowSec) !== null;
  }

  delete(key: string): boolean {
    return this.entries.delete(key);
  }

  // Prune expired entries; call occasionally to bound memory usage.
  prune(nowSec: number): number {
    let n = 0;
    for (const [k, e] of this.entries) {
      if (nowSec >= e.expiresAtSec) {
        this.entries.delete(k);
        n++;
      }
    }
    return n;
  }

  get size(): number {
    return this.entries.size;
  }
}

// Common memory keys as constants to avoid typos across call sites.
export const AI_MEMORY_KEYS = {
  LAST_HURT_BY: 'last_hurt_by',
  LAST_HURT_AT_SEC: 'last_hurt_at_sec',
  LAST_ATTACKED_TARGET: 'last_attacked_target',
  VISIBLE_TARGET: 'visible_target',
  HOME: 'home',
  PATROL_TARGET: 'patrol_target',
  NEAREST_ENEMY: 'nearest_enemy',
  ANGER_TARGET: 'anger_target',
  HIDE_FROM: 'hide_from',
  IS_PACIFIED: 'is_pacified',
} as const;
