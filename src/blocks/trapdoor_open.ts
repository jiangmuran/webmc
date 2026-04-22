// Trapdoor. Toggles on right-click (wooden) or redstone power.
// Opens upward when clicked from above, otherwise sideways flap.
// Iron trapdoor ignores right-click (redstone only).

export interface TrapdoorState {
  open: boolean;
  half: 'top' | 'bottom';
  facing: 'north' | 'east' | 'south' | 'west';
  material: 'wood' | 'iron';
  powered: boolean;
}

export function toggleFromClick(t: TrapdoorState): TrapdoorState {
  if (t.material === 'iron') return t;
  return { ...t, open: !t.open };
}

export function onRedstonePower(t: TrapdoorState, powered: boolean): TrapdoorState {
  return { ...t, open: powered, powered };
}

export function blocksMovement(t: TrapdoorState): boolean {
  return !t.open;
}

export function isClimbable(t: TrapdoorState, below: 'ladder' | 'other'): boolean {
  return t.open && below === 'ladder';
}
