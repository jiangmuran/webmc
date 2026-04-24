export interface CrosshairInput {
  targetEntity?: { hostile: boolean; targetable: boolean };
  targetBlockBreakable: boolean;
  cooldownFraction: number;
}

export function crosshairColor(i: CrosshairInput): [number, number, number] {
  if (i.targetEntity !== undefined) {
    return i.targetEntity.hostile ? [1, 0.6, 0.6] : [0.6, 1, 0.6];
  }
  if (i.targetBlockBreakable) return [1, 1, 1];
  return [0.5, 0.5, 0.5];
}

export function ringProgressAlpha(cooldownFraction: number): number {
  return Math.max(0, Math.min(1, cooldownFraction));
}
