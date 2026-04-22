// Dragon egg drop rules. Falling from any height; piston can push it.
// Cannot be mined with creative instant-mine; must be pushed or hit.

export interface EggDropQuery {
  fallDistance: number;
  pushedByPiston: boolean;
  hitByExplosion: boolean;
}

export function willDropAsItem(q: EggDropQuery): boolean {
  if (q.pushedByPiston) return true;
  if (q.hitByExplosion) return true;
  return q.fallDistance > 1;
}

// Dragon egg fall: breaks the block it lands on (if replaceable).
export function breaksCellOnLanding(targetBlockId: string): boolean {
  if (targetBlockId === 'webmc:air') return false;
  if (targetBlockId === 'webmc:water') return false;
  // Torch, grass, flowers are replaceable; fall damages them.
  const REPLACEABLE = new Set(['webmc:torch', 'webmc:grass', 'webmc:tall_grass']);
  return REPLACEABLE.has(targetBlockId);
}

// Dragon egg dropped item: 1 count, stacks separately in hotbar.
export const STACK_MAX = 64;
