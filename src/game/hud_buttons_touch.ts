// Touch HUD button layout. Provides canonical positions for jump,
// sneak, fly (creative), interact, drop. Positions are normalized
// (0..1) relative to screen; anchored to bottom-right quadrant.

export type HudButtonId = 'jump' | 'sneak' | 'fly' | 'interact' | 'drop';

export interface ButtonLayout {
  id: HudButtonId;
  ux: number; // 0..1
  uy: number;
  size: number; // radius in px at a reference DPI
  visible: boolean;
}

export interface LayoutQuery {
  screenWidth: number;
  screenHeight: number;
  isCreative: boolean;
  isTouchDevice: boolean;
}

export function defaultLayout(q: LayoutQuery): ButtonLayout[] {
  if (!q.isTouchDevice) return [];
  return [
    { id: 'jump', ux: 0.88, uy: 0.72, size: 64, visible: true },
    { id: 'sneak', ux: 0.13, uy: 0.88, size: 52, visible: true },
    { id: 'fly', ux: 0.88, uy: 0.58, size: 52, visible: q.isCreative },
    { id: 'interact', ux: 0.75, uy: 0.86, size: 56, visible: true },
    { id: 'drop', ux: 0.5, uy: 0.92, size: 40, visible: true },
  ];
}

// Hit test: returns button id under the given pixel point.
export function hitTest(
  layout: ButtonLayout[],
  q: LayoutQuery,
  px: number,
  py: number,
): HudButtonId | null {
  for (const b of layout) {
    if (!b.visible) continue;
    const cx = b.ux * q.screenWidth;
    const cy = b.uy * q.screenHeight;
    const dx = px - cx;
    const dy = py - cy;
    if (dx * dx + dy * dy <= b.size * b.size) return b.id;
  }
  return null;
}
