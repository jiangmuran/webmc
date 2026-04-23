export type DripleafTilt = 'none' | 'unstable' | 'partial' | 'full';

export const CYCLE: DripleafTilt[] = ['none', 'unstable', 'partial', 'full'];

export const TILT_DELAYS_TICKS: Record<DripleafTilt, number> = {
  none: 0,
  unstable: 10,
  partial: 10,
  full: 100,
};

export function nextTilt(t: DripleafTilt): DripleafTilt {
  const i = CYCLE.indexOf(t);
  return i < 0 || i >= CYCLE.length - 1 ? 'full' : (CYCLE[i + 1] ?? 'full');
}

export function collapsesPlayer(t: DripleafTilt): boolean {
  return t === 'full';
}

export function resetsAfterTick(t: DripleafTilt, ticksSinceTilt: number): boolean {
  return t === 'full' && ticksSinceTilt >= TILT_DELAYS_TICKS.full;
}
