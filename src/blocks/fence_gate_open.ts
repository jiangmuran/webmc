// Fence gate. Opens on right-click; also toggles when adjacent
// redstone is powered. Opening direction flips based on player side.

export type FenceGateFacing = 'north' | 'south' | 'east' | 'west';

export interface FenceGate {
  facing: FenceGateFacing;
  open: boolean;
  poweredByRedstone: boolean;
  inWall: boolean;
}

export function openGateManually(g: FenceGate, playerOnSide: FenceGateFacing): void {
  g.open = true;
  // Flip facing if the player is on the "back" side so the gate
  // swings toward them.
  const flipped: Record<FenceGateFacing, FenceGateFacing> = {
    north: 'south',
    south: 'north',
    east: 'west',
    west: 'east',
  };
  if (playerOnSide === flipped[g.facing]) g.facing = flipped[g.facing];
}

export function closeGateManually(g: FenceGate): void {
  g.open = false;
}

export function onRedstoneUpdate(g: FenceGate, powered: boolean): void {
  const was = g.poweredByRedstone;
  g.poweredByRedstone = powered;
  if (!was && powered) g.open = true;
  else if (was && !powered) g.open = false;
}

// In-wall gates have a slightly lower render height.
export function renderHeight(g: FenceGate): number {
  return g.inWall ? 1.0 : 1.5;
}
