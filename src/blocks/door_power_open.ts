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

// Wiki (minecraft.wiki/w/Copper_Door, /w/Iron_Door): only iron doors
// reject hand interaction. Copper doors (and their oxidation
// variants) accept right-click toggling AND redstone — see
// copper_door.ts. Old set lumped copper with iron, blocking hand-open
// for every copper door.
export const NEEDS_POWER_DOORS = new Set(['iron_door']);

export function canHandOpen(doorId: string): boolean {
  return !NEEDS_POWER_DOORS.has(doorId);
}
