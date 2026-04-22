// Mob fleeing logic. When a passive mob takes damage, it flees from
// the attacker for ~3s at 1.2x walking speed. Wolves/iron golems never
// flee; zombies/skeletons never flee.

export type MobKind = 'passive' | 'neutral' | 'hostile' | 'boss';

export interface FleeState {
  fleeingFromId: string | null;
  fleeUntilMs: number;
}

export const FLEE_DURATION_MS = 3000;
export const FLEE_SPEED_MULT = 1.2;

export function makeFlee(): FleeState {
  return { fleeingFromId: null, fleeUntilMs: 0 };
}

export interface AttackEvent {
  kind: MobKind;
  attackerId: string;
  nowMs: number;
}

export function onHit(s: FleeState, e: AttackEvent): void {
  if (e.kind !== 'passive') return;
  s.fleeingFromId = e.attackerId;
  s.fleeUntilMs = e.nowMs + FLEE_DURATION_MS;
}

export function isFleeing(s: FleeState, nowMs: number): boolean {
  return nowMs < s.fleeUntilMs;
}

export function speedMultiplier(s: FleeState, nowMs: number): number {
  return isFleeing(s, nowMs) ? FLEE_SPEED_MULT : 1;
}
