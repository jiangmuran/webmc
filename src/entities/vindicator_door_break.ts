// Vindicator breaks wooden doors. During raids only; outside raids
// attacks like a normal hostile mob.

export interface VindicatorState {
  inRaid: boolean;
  breakTargetPos: { x: number; y: number; z: number } | null;
  breakProgress: number; // 0..1
  isJohnny: boolean; // named "Johnny" → attacks everything
}

export const BREAK_TICKS_NORMAL = 240;
export const BREAK_TICKS_HARD = 120;

export interface BreakDoorQuery {
  difficulty: 'easy' | 'normal' | 'hard';
  doorPos: { x: number; y: number; z: number };
  deltaTicks: number;
}

export function tickBreakDoor(
  v: VindicatorState,
  q: BreakDoorQuery,
): 'broken' | 'progress' | 'not_attacking' {
  if (!v.inRaid && !v.isJohnny) return 'not_attacking';
  const total = q.difficulty === 'hard' ? BREAK_TICKS_HARD : BREAK_TICKS_NORMAL;
  if (!v.breakTargetPos) {
    v.breakTargetPos = q.doorPos;
    v.breakProgress = 0;
  }
  v.breakProgress += q.deltaTicks / total;
  if (v.breakProgress >= 1) {
    v.breakTargetPos = null;
    v.breakProgress = 0;
    return 'broken';
  }
  return 'progress';
}

// Targets:
// - In raid: attacks villagers, players, iron golems.
// - Johnny: attacks everything except other illagers.
// - Normal: attacks players on sight.
export function attackTargetKinds(v: VindicatorState): string[] {
  if (v.isJohnny) return ['player', 'villager', 'iron_golem', 'animal', 'mob'];
  if (v.inRaid) return ['player', 'villager', 'iron_golem'];
  return ['player'];
}
