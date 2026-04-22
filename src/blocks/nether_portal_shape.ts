// Nether portal shape validation. Must be a rectangle of obsidian
// 4-23 wide and 5-23 tall, filled with portal blocks inside.

export interface PortalFrame {
  width: number;
  height: number;
  axis: 'x' | 'z';
}

export const MIN_WIDTH = 4;
export const MAX_WIDTH = 23;
export const MIN_HEIGHT = 5;
export const MAX_HEIGHT = 23;

export function isValidFrame(f: PortalFrame): boolean {
  if (f.width < MIN_WIDTH || f.width > MAX_WIDTH) return false;
  if (f.height < MIN_HEIGHT || f.height > MAX_HEIGHT) return false;
  return true;
}

export function interiorWidth(f: PortalFrame): number {
  return f.width - 2;
}

export function interiorHeight(f: PortalFrame): number {
  return f.height - 2;
}

export function portalBlocksCount(f: PortalFrame): number {
  if (!isValidFrame(f)) return 0;
  return interiorWidth(f) * interiorHeight(f);
}

// Minimum classic 4x5 frame = 2x3 portal blocks = 6.
export function minimumSize(): number {
  return 6;
}
