export const MIN_PORTAL_WIDTH = 4;
export const MAX_PORTAL_WIDTH = 23;
export const MIN_PORTAL_HEIGHT = 5;
export const MAX_PORTAL_HEIGHT = 23;

export interface FrameSpec {
  width: number;
  height: number;
}

export function isValidFrame(s: FrameSpec): boolean {
  if (s.width < MIN_PORTAL_WIDTH || s.width > MAX_PORTAL_WIDTH) return false;
  if (s.height < MIN_PORTAL_HEIGHT || s.height > MAX_PORTAL_HEIGHT) return false;
  return true;
}

export function innerArea(s: FrameSpec): number {
  if (!isValidFrame(s)) return 0;
  return (s.width - 2) * (s.height - 2);
}
