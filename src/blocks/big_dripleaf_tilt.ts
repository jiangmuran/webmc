export type Tilt = 'none' | 'unstable' | 'partial' | 'full';

export const TILT_DELAY_TICKS = 10;
export const FULL_FALL_DELAY_TICKS = 5;

export function onEntityLand(t: Tilt): Tilt {
  switch (t) {
    case 'none':
      return 'unstable';
    case 'unstable':
      return 'partial';
    case 'partial':
      return 'full';
    default:
      return 'full';
  }
}

export function passable(t: Tilt): boolean {
  return t === 'full';
}

export function scheduledResetTicks(t: Tilt): number {
  return t === 'full' ? 100 : TILT_DELAY_TICKS;
}
