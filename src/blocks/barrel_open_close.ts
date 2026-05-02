export interface BarrelState {
  open: boolean;
  viewerCount: number;
  facing: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
}

export function onPlayerOpen(s: BarrelState): BarrelState {
  return { ...s, open: true, viewerCount: s.viewerCount + 1 };
}

export function onPlayerClose(s: BarrelState): BarrelState {
  const v = Math.max(0, s.viewerCount - 1);
  return { ...s, open: v > 0, viewerCount: v };
}

// Wiki (minecraft.wiki/w/Barrel): "Unlike chests, the action of
// opening a barrel is never prevented." Old code returned true when
// an up-facing barrel had a block above — that's chest behavior, and
// it's the exact distinction the wiki calls out. Sibling
// barrel_facing_rules.canOpen() already returned `true` always.
// Keep the function (so callers don't break) but it now matches the
// wiki: never blocked.
export function blockedByBlockAbove(_s: BarrelState, _blockAbove: string): boolean {
  return false;
}
