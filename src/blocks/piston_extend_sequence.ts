// Piston extension animation sequence. Tick 0: start extend (place
// moving block entity). Tick 1: finalize (replace moving with destination).
// Retraction symmetric for sticky pistons.

export type PistonPhase = 'idle' | 'extending' | 'extended' | 'retracting';

export interface Piston {
  sticky: boolean;
  phase: PistonPhase;
  phaseTicks: number;
  powered: boolean;
}

export const EXTEND_TICKS = 2;
export const RETRACT_TICKS = 2;

export function makePiston(sticky = false): Piston {
  return { sticky, phase: 'idle', phaseTicks: 0, powered: false };
}

export interface TickQuery {
  powered: boolean;
}

export type Transition =
  | 'none'
  | 'begin_extend'
  | 'finish_extend'
  | 'begin_retract'
  | 'finish_retract';

export function tickPiston(p: Piston, q: TickQuery): Transition {
  p.powered = q.powered;
  if (p.phase === 'idle') {
    if (q.powered) {
      p.phase = 'extending';
      p.phaseTicks = 0;
      return 'begin_extend';
    }
    return 'none';
  }
  if (p.phase === 'extending') {
    p.phaseTicks += 1;
    if (p.phaseTicks >= EXTEND_TICKS) {
      p.phase = 'extended';
      p.phaseTicks = 0;
      return 'finish_extend';
    }
    return 'none';
  }
  if (p.phase === 'extended') {
    if (!q.powered) {
      p.phase = 'retracting';
      p.phaseTicks = 0;
      return 'begin_retract';
    }
    return 'none';
  }
  p.phaseTicks += 1;
  if (p.phaseTicks >= RETRACT_TICKS) {
    p.phase = 'idle';
    p.phaseTicks = 0;
    return 'finish_retract';
  }
  return 'none';
}
