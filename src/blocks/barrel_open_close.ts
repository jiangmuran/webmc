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

export function blockedByBlockAbove(s: BarrelState, blockAbove: string): boolean {
  return s.facing === 'up' && blockAbove !== 'air';
}
