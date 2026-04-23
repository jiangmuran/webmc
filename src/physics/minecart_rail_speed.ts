export type RailType = 'regular' | 'powered' | 'detector' | 'activator';

export interface MinecartInput {
  railType: RailType;
  powered: boolean;
  currentSpeed: number;
  slope: number;
  hasPassenger: boolean;
}

export const MAX_SPEED_NORMAL = 0.4;
export const MAX_SPEED_POWERED = 0.8;

export function speedAfterTick(i: MinecartInput): number {
  let speed = i.currentSpeed;
  if (i.railType === 'powered') {
    if (i.powered) speed = i.hasPassenger ? speed + 0.06 : speed + 0.02;
    else speed *= 0.5;
  } else {
    speed *= 0.996;
  }
  speed += i.slope * 0.01;
  return Math.max(0, Math.min(MAX_SPEED_POWERED, speed));
}

export function shouldEjectOnActivator(i: MinecartInput): boolean {
  return i.railType === 'activator' && i.powered && i.hasPassenger;
}
