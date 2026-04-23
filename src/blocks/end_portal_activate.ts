export interface FrameSlot {
  hasEye: boolean;
}

export const REQUIRED_FRAME_COUNT = 12;

export function isActive(frames: FrameSlot[]): boolean {
  if (frames.length !== REQUIRED_FRAME_COUNT) return false;
  return frames.every((f) => f.hasEye);
}

export function eyesMissing(frames: FrameSlot[]): number {
  return frames.filter((f) => !f.hasEye).length;
}

export function canPlaceEyeAt(f: FrameSlot): boolean {
  return !f.hasEye;
}
