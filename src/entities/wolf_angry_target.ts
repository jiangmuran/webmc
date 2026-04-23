export interface WolfState {
  tamed: boolean;
  ownerId?: string;
  angryAtId?: string;
  angryTicksRemaining: number;
}

export const ANGRY_DURATION = 20 * 15;

export function attackedBy(s: WolfState, attackerId: string): WolfState {
  if (s.tamed && attackerId === s.ownerId) return s;
  return { ...s, angryAtId: attackerId, angryTicksRemaining: ANGRY_DURATION };
}

export function tickAnger(s: WolfState): WolfState {
  if (s.angryTicksRemaining <= 0) {
    const next: WolfState = {
      tamed: s.tamed,
      angryTicksRemaining: 0,
    };
    if (s.ownerId !== undefined) next.ownerId = s.ownerId;
    return next;
  }
  const ticks = s.angryTicksRemaining - 1;
  if (ticks === 0) {
    const next: WolfState = {
      tamed: s.tamed,
      angryTicksRemaining: 0,
    };
    if (s.ownerId !== undefined) next.ownerId = s.ownerId;
    return next;
  }
  return { ...s, angryTicksRemaining: ticks };
}

export function isHostileTo(s: WolfState, targetId: string): boolean {
  return s.angryTicksRemaining > 0 && s.angryAtId === targetId;
}
