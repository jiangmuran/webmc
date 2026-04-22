// Sticky piston. Pulls the block in front when retracting (unless a
// honey/slime block is in between that would break the sticky rule).

export interface StickyRetractCtx {
  frontBlock: 'slime' | 'honey' | 'other' | 'air';
  inBetweenWasHoneyOrSlime: boolean;
}

export type RetractOutcome =
  | { kind: 'pull'; blockId: 'slime' | 'honey' | 'other' }
  | { kind: 'no_pull' };

export function retract(c: StickyRetractCtx): RetractOutcome {
  if (c.frontBlock === 'air') return { kind: 'no_pull' };
  if (c.inBetweenWasHoneyOrSlime) return { kind: 'no_pull' };
  return { kind: 'pull', blockId: c.frontBlock };
}

export function pullsEntity(): boolean {
  return false;
}

// Sticky pistons can push up to 12 blocks like normal pistons.
export const STICKY_PISTON_PUSH_LIMIT = 12;
