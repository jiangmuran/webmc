export interface LodestoneCompass {
  targetX?: number;
  targetY?: number;
  targetZ?: number;
  targetDim?: string;
}

export function isLinked(c: LodestoneCompass): boolean {
  return c.targetX !== undefined && c.targetZ !== undefined;
}

export function bearingTo(
  c: LodestoneCompass,
  fromX: number,
  fromZ: number,
): number | undefined {
  if (!isLinked(c) || c.targetX === undefined || c.targetZ === undefined) return undefined;
  return Math.atan2(c.targetZ - fromZ, c.targetX - fromX);
}

export function spinsOutOfDimension(c: LodestoneCompass, currentDim: string): boolean {
  return c.targetDim !== undefined && c.targetDim !== currentDim;
}
