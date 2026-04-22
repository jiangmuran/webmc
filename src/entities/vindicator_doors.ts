// Vindicator + raid behavior: can break wooden doors during raids.

export interface VindicatorState {
  inRaid: boolean;
}

export function makeVindicator(inRaid = false): VindicatorState {
  return { inRaid };
}

export interface DoorBreakQuery {
  blockName: string;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
}

export function canBreakDoor(state: VindicatorState, q: DoorBreakQuery): boolean {
  if (!state.inRaid) return false;
  if (q.difficulty !== 'hard' && q.difficulty !== 'normal') return false;
  return q.blockName.endsWith('_door') && !q.blockName.includes('iron');
}

export const DOOR_BREAK_SEC = 6;
