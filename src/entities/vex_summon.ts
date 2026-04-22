// Vex entities summoned by evokers. Small, flying, ghostly; lifetime
// 30-120s. Can pass through walls. Drop iron sword sometimes.

export interface Vex {
  ttlTicks: number;
  summonerEvokerId: string | null;
  hasWeapon: boolean;
}

export const MIN_TTL = 600;
export const MAX_TTL = 2400;

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
