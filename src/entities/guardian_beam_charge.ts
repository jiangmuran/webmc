// Guardian laser charge-up. Guardians and elders charge for 80 ticks
// (4 s) before firing; the target-lock is broken if LOS is lost or the
// target leaves a 15 block range.
//
// Wiki (minecraft.wiki/w/Guardian): "The laser has a maximum range of
// 15 blocks." Old TARGET_RANGE = 16 was a 7% over-reach — guardians
// could lock on (and fire) at 16-block range, slightly past wiki canon.

export type BeamPhase = 'idle' | 'charging' | 'firing' | 'cooldown';

export interface BeamState {
  phase: BeamPhase;
  phaseTicks: number;
  targetId: string | null;
}

export const CHARGE_TICKS = 80;
export const FIRE_TICKS = 1;
// Wiki (minecraft.wiki/w/Guardian): "Guardians swim around for 3
// seconds before firing again." 3 s = 60 ticks. Old COOLDOWN_TICKS
// = 40 (2 s) was 33% under wiki — guardians fired ~50% more often
// than canon. Sibling guardian_laser.ts (COOLDOWN_SEC = 3) already
// uses the correct value.
export const COOLDOWN_TICKS = 60;
export const TARGET_RANGE = 15;

export function makeBeam(): BeamState {
  return { phase: 'idle', phaseTicks: 0, targetId: null };
}

export interface TickQuery {
  target: { id: string; distance: number; hasLineOfSight: boolean } | null;
}

export interface TickResult {
  fired: boolean;
  phaseChanged: boolean;
}

export function tickBeam(s: BeamState, q: TickQuery): TickResult {
  const prev = s.phase;
  s.phaseTicks += 1;

  if (s.phase === 'idle') {
    if (q.target && q.target.distance <= TARGET_RANGE && q.target.hasLineOfSight) {
      s.phase = 'charging';
      s.phaseTicks = 0;
      s.targetId = q.target.id;
    }
  } else if (s.phase === 'charging') {
    const lost =
      q.target?.id !== s.targetId || q.target.distance > TARGET_RANGE || !q.target.hasLineOfSight;
    if (lost) {
      s.phase = 'idle';
      s.phaseTicks = 0;
      s.targetId = null;
    } else if (s.phaseTicks >= CHARGE_TICKS) {
      s.phase = 'firing';
      s.phaseTicks = 0;
    }
  } else if (s.phase === 'firing') {
    if (s.phaseTicks >= FIRE_TICKS) {
      s.phase = 'cooldown';
      s.phaseTicks = 0;
      return { fired: true, phaseChanged: true };
    }
  } else {
    if (s.phaseTicks >= COOLDOWN_TICKS) {
      s.phase = 'idle';
      s.phaseTicks = 0;
      s.targetId = null;
    }
  }
  return { fired: false, phaseChanged: prev !== s.phase };
}
