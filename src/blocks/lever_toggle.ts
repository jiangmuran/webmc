export interface Lever {
  powered: boolean;
  lastToggledTick: number;
}

export const POWER_ON = 15;

export function toggle(l: Lever, nowTick: number): Lever {
  return { powered: !l.powered, lastToggledTick: nowTick };
}

export function power(l: Lever): number {
  return l.powered ? POWER_ON : 0;
}

export function canAttachTo(_face: 'wall' | 'floor' | 'ceiling'): boolean {
  return true;
}
