// Big dripleaf: lush caves platform. Tilts when entity steps on it;
// returns after a delay. Bonemeal grows vertically from small dripleaf.

export type DripleafTilt = 'none' | 'unstable' | 'partial' | 'full';

export interface BigDripleafState {
  tilt: DripleafTilt;
  ticksInTiltState: number;
}

export const TILT_UNSTABLE_TICKS = 10;
export const TILT_PARTIAL_TICKS = 10;
export const TILT_FULL_TICKS = 100;

export function onSteppedOn(s: BigDripleafState): BigDripleafState {
  if (s.tilt !== 'none') return s;
  return { tilt: 'unstable', ticksInTiltState: 0 };
}

export function tick(s: BigDripleafState): BigDripleafState {
  const next = s.ticksInTiltState + 1;
  if (s.tilt === 'unstable' && next >= TILT_UNSTABLE_TICKS)
    return { tilt: 'partial', ticksInTiltState: 0 };
  if (s.tilt === 'partial' && next >= TILT_PARTIAL_TICKS)
    return { tilt: 'full', ticksInTiltState: 0 };
  if (s.tilt === 'full' && next >= TILT_FULL_TICKS) return { tilt: 'none', ticksInTiltState: 0 };
  return { ...s, ticksInTiltState: next };
}

export function isWalkable(s: BigDripleafState): boolean {
  return s.tilt !== 'full';
}
