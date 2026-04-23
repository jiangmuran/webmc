export const AXE_DISABLE_TICKS = 100;
export const MANUAL_RAISE_COOLDOWN = 5;

export interface ShieldState {
  raised: boolean;
  disabledTicksRemaining: number;
  raiseCooldownTicks: number;
}

export function hitByAxe(s: ShieldState, critical: boolean): ShieldState {
  return { ...s, raised: false, disabledTicksRemaining: AXE_DISABLE_TICKS + (critical ? 20 : 0) };
}

export function tick(s: ShieldState): ShieldState {
  return {
    raised: s.raised && s.disabledTicksRemaining === 0,
    disabledTicksRemaining: Math.max(0, s.disabledTicksRemaining - 1),
    raiseCooldownTicks: Math.max(0, s.raiseCooldownTicks - 1),
  };
}

export function canRaise(s: ShieldState): boolean {
  return s.disabledTicksRemaining === 0 && s.raiseCooldownTicks === 0;
}
