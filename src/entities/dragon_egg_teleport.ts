// Wiki (minecraft.wiki/w/Dragon_Egg): "When clicked or attacked, the
// dragon egg teleports up to 15 blocks horizontally and ±3 vertically."
// Old `floor(rng() * (MAX × 2)) - MAX` gave -15..+14 — the canonical
// +15 cell was unreachable. Replaced with the inclusive `(2N+1)` span
// so the full -MAX..+MAX range is covered on each horizontal axis.
export const MAX_TELEPORT_DISTANCE = 15;

export function teleportOffset(rng: () => number): { dx: number; dy: number; dz: number } {
  const span = MAX_TELEPORT_DISTANCE * 2 + 1;
  return {
    dx: Math.floor(rng() * span) - MAX_TELEPORT_DISTANCE,
    dy: Math.floor(rng() * 7) - 3,
    dz: Math.floor(rng() * span) - MAX_TELEPORT_DISTANCE,
  };
}

export function onInteract(_hitInteract: 'click' | 'hit'): 'teleport' | 'fall' {
  return 'teleport';
}

export function isGravity(): boolean {
  return true;
}
