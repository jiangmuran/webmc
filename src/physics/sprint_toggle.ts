export interface SprintState {
  doubleTappedForward: boolean;
  currentHunger: number;
  holdingForward: boolean;
  sprinting: boolean;
}

export const MIN_HUNGER_TO_SPRINT = 6;

export function canStart(s: SprintState): boolean {
  return s.doubleTappedForward && s.currentHunger > MIN_HUNGER_TO_SPRINT;
}

export function shouldStopSprinting(s: SprintState): boolean {
  if (!s.sprinting) return false;
  if (!s.holdingForward) return true;
  if (s.currentHunger <= MIN_HUNGER_TO_SPRINT) return true;
  return false;
}
