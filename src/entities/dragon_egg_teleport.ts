export const MAX_TELEPORT_DISTANCE = 15;

export function teleportOffset(rng: () => number): { dx: number; dy: number; dz: number } {
  return {
    dx: Math.floor(rng() * (MAX_TELEPORT_DISTANCE * 2)) - MAX_TELEPORT_DISTANCE,
    dy: Math.floor(rng() * 7) - 3,
    dz: Math.floor(rng() * (MAX_TELEPORT_DISTANCE * 2)) - MAX_TELEPORT_DISTANCE,
  };
}

export function onInteract(_hitInteract: 'click' | 'hit'): 'teleport' | 'fall' {
  return 'teleport';
}

export function isGravity(): boolean {
  return true;
}
