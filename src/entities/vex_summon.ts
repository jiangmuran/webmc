// Vex entities summoned by evokers. Small, flying, ghostly; vexes
// summoned by an evoker take damage after 30-119 seconds. Can pass
// through walls. Drop iron sword sometimes.
//
// Wiki (minecraft.wiki/w/Vex): "Vexes summoned by an evoker start
// taking damage after 30 to 119 seconds and eventually die." So the
// pre-decay lifetime is 600-2380 ticks (30s × 20 to 119s × 20).
//
// Old MAX_TTL = 2400 (120s) was 1 second over the wiki ceiling.
// Vexes from monster spawners / commands do NOT take damage this
// way; this constant applies only to evoker-summoned vexes.

export interface Vex {
  ttlTicks: number;
  summonerEvokerId: string | null;
  hasWeapon: boolean;
}

export const MIN_TTL = 600; // 30 s
export const MAX_TTL = 2380; // 119 s

export function makeVex(rand: () => number, evokerId: string): Vex {
  return {
    ttlTicks: MIN_TTL + Math.min(MAX_TTL - MIN_TTL, Math.floor(rand() * (MAX_TTL - MIN_TTL + 1))),
    summonerEvokerId: evokerId,
    hasWeapon: true,
  };
}

export interface TickResult {
  despawned: boolean;
}

export function tickVex(v: Vex): TickResult {
  if (v.ttlTicks <= 0) return { despawned: true };
  v.ttlTicks -= 1;
  return { despawned: v.ttlTicks <= 0 };
}

// Vex phase cannot pass through portal, etc. — exposed as filter.
export function passable(blockId: string): boolean {
  return (
    !blockId.endsWith('_portal') &&
    blockId !== 'webmc:bedrock' &&
    blockId !== 'webmc:barrier' &&
    blockId !== 'webmc:command_block'
  );
}

// Charged vs relaxed: a vex in melee attacks with its sword drawn.
export interface AttackQuery {
  targetInRange: boolean;
  nowMs: number;
  lastAttackMs: number;
}

export const ATTACK_COOLDOWN_MS = 500;

export function canAttack(q: AttackQuery): boolean {
  return q.targetInRange && q.nowMs - q.lastAttackMs >= ATTACK_COOLDOWN_MS;
}
