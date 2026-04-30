// Warden anger management. Each entity has its own anger value per target
// in the range 0..150. 35+ means the warden considers the entity "suspected",
// 80+ means "primary target", 150 triggers a sonic boom windup.
// Anger decays by 1 per second outside combat; adds on stimuli.
//
// Wiki (minecraft.wiki/w/Warden#Suspense): "It adds 10 anger if
// the vibration was from a projectile or 35 anger for other
// vibrations." Old projectile_hit = 20 was 2× wiki — wardens got
// angry at projectile-throwing players much faster than canon.

export const WARDEN_ANGER_MAX = 150;
export const WARDEN_ANGER_SUSPECT = 35;
export const WARDEN_ANGER_TARGET = 80;

export type AngerStimulus =
  | 'projectile_hit'
  | 'melee_hit'
  | 'shrieker_witness'
  | 'vibration_close'
  | 'vibration_far';

const STIMULUS_GAIN: Record<AngerStimulus, number> = {
  projectile_hit: 10,
  melee_hit: 35,
  shrieker_witness: 35,
  vibration_close: 15,
  vibration_far: 5,
};

const DECAY_PER_SEC = 1;

export interface WardenAnger {
  perTarget: Map<string, number>;
}

export function makeWardenAnger(): WardenAnger {
  return { perTarget: new Map() };
}

export function addAnger(state: WardenAnger, targetId: string, stim: AngerStimulus): number {
  const cur = state.perTarget.get(targetId) ?? 0;
  const next = Math.min(WARDEN_ANGER_MAX, cur + STIMULUS_GAIN[stim]);
  state.perTarget.set(targetId, next);
  return next;
}

export function decayAnger(state: WardenAnger, dtSec: number): void {
  const delta = DECAY_PER_SEC * dtSec;
  for (const [id, v] of state.perTarget) {
    const next = v - delta;
    if (next <= 0) state.perTarget.delete(id);
    else state.perTarget.set(id, next);
  }
}

export type AngerLevel = 'calm' | 'suspect' | 'target' | 'sonic_windup';

export function angerLevel(state: WardenAnger, targetId: string): AngerLevel {
  const v = state.perTarget.get(targetId) ?? 0;
  if (v >= WARDEN_ANGER_MAX) return 'sonic_windup';
  if (v >= WARDEN_ANGER_TARGET) return 'target';
  if (v >= WARDEN_ANGER_SUSPECT) return 'suspect';
  return 'calm';
}

// The warden always locks on to the highest-anger target. Ties break
// by arbitrary map insertion order, which the Map's iteration preserves.
export function primaryTarget(state: WardenAnger): string | null {
  let best: string | null = null;
  let bestVal = 0;
  for (const [id, v] of state.perTarget) {
    if (v > bestVal) {
      best = id;
      bestVal = v;
    }
  }
  return best;
}
