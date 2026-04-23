// First-person arm swing animation. Linear-ish back-and-forth on each
// attack/use; independent from walk bobbing.

export const ARM_SWING_DURATION_TICKS = 6;

export interface ArmSwingState {
  progress: number;
  targetReached: boolean;
}

export function initSwing(): ArmSwingState {
  return { progress: 0, targetReached: false };
}

export function trigger(_s: ArmSwingState): ArmSwingState {
  return { progress: 0, targetReached: false };
}

export function tick(s: ArmSwingState): ArmSwingState {
  const np = Math.min(1, s.progress + 1 / ARM_SWING_DURATION_TICKS);
  return { progress: np, targetReached: np >= 0.999 };
}

export function angleRadians(s: ArmSwingState): number {
  return Math.sin(s.progress * Math.PI) * 0.4;
}

export function isActive(s: ArmSwingState): boolean {
  return s.progress > 0 && s.progress < 1;
}
