export type Half = 'upper' | 'lower';
export type Hinge = 'left' | 'right';

export interface DoorState {
  half: Half;
  hinge: Hinge;
  open: boolean;
  powered: boolean;
}

export function syncedHalf(current: DoorState, neighbor: DoorState): DoorState {
  return { ...current, open: neighbor.open, powered: neighbor.powered };
}

export function onRedstonePower(d: DoorState, powered: boolean): DoorState {
  if (d.powered === powered) return d;
  return { ...d, powered, open: powered };
}

export const IRON_DOOR_IDS = new Set(['iron_door', 'copper_door']);

export function canHandOpen(doorId: string): boolean {
  return !IRON_DOOR_IDS.has(doorId);
}
