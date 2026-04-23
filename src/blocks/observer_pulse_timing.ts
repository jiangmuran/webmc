// Observer emits 2-tick redstone pulse when the block in front changes.

export const OBSERVER_PULSE_TICKS = 2;

export interface ObserverState {
  frontBlockState: string;
  ticksRemaining: number;
}

export function onWorldTick(s: ObserverState, nowFrontState: string): ObserverState {
  if (nowFrontState !== s.frontBlockState) {
    return { frontBlockState: nowFrontState, ticksRemaining: OBSERVER_PULSE_TICKS };
  }
  if (s.ticksRemaining <= 0) return s;
  return { ...s, ticksRemaining: s.ticksRemaining - 1 };
}

export function outputPower(s: ObserverState): number {
  return s.ticksRemaining > 0 ? 15 : 0;
}

export function triggersByBlockState(): boolean {
  return true;
}
