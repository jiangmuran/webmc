// Ravager charge attack. Builds up for 1.5s then dashes 8 blocks at
// 0.5 block/tick. Knocks back + high damage on hit; stuns itself for
// 2s afterward.

export type RavagerPhase = 'idle' | 'winding' | 'dashing' | 'stunned';

export interface Ravager {
  phase: RavagerPhase;
  phaseTicks: number;
  targetId: string | null;
}

export const WIND_TICKS = 30; // 1.5s @ 20Hz
export const DASH_TICKS = 16; // ~8 blocks at 0.5/tick
export const STUN_TICKS = 40;

export function makeRavager(): Ravager {
  return { phase: 'idle', phaseTicks: 0, targetId: null };
}

export interface TickQuery {
  targetInRange: boolean;
  targetId: string | null;
}

export interface TickResult {
  event: 'begin_dash' | 'dash_hit' | 'stun_end' | null;
}

export function tickRavager(r: Ravager, q: TickQuery): TickResult {
  r.phaseTicks += 1;
  if (r.phase === 'idle') {
    if (q.targetInRange && q.targetId) {
      r.phase = 'winding';
      r.phaseTicks = 0;
      r.targetId = q.targetId;
    }
    return { event: null };
  }
  if (r.phase === 'winding') {
    if (r.phaseTicks >= WIND_TICKS) {
      r.phase = 'dashing';
      r.phaseTicks = 0;
      return { event: 'begin_dash' };
    }
    return { event: null };
  }
  if (r.phase === 'dashing') {
    if (r.phaseTicks >= DASH_TICKS) {
      r.phase = 'stunned';
      r.phaseTicks = 0;
      return { event: 'dash_hit' };
    }
    return { event: null };
  }
  if (r.phaseTicks >= STUN_TICKS) {
    r.phase = 'idle';
    r.phaseTicks = 0;
    r.targetId = null;
    return { event: 'stun_end' };
  }
  return { event: null };
}
