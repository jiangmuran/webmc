export type Direction = 'north' | 'south' | 'east' | 'west';

export interface Frame {
  hasEye: boolean;
  facing: Direction;
}

export function isComplete(frames: readonly (Frame | undefined)[]): boolean {
  if (frames.length !== 12) return false;
  if (frames.some((f) => f === undefined)) return false;
  return frames.every((f) => f?.hasEye === true);
}

export function portalFrameCoordinates(
  cornerX: number,
  _y: number,
  cornerZ: number,
): readonly { x: number; z: number; facing: Direction }[] {
  const out: { x: number; z: number; facing: Direction }[] = [];
  for (let i = 0; i < 3; i++) {
    out.push({ x: cornerX + 1 + i, z: cornerZ, facing: 'south' });
    out.push({ x: cornerX + 1 + i, z: cornerZ + 4, facing: 'north' });
    out.push({ x: cornerX, z: cornerZ + 1 + i, facing: 'east' });
    out.push({ x: cornerX + 4, z: cornerZ + 1 + i, facing: 'west' });
  }
  return out;
}
