export const PER_LEVEL_REDUCTION = 0.08;
export const MAX_LEVEL = 4;
export const CAP = 0.8;

export function reduction(level: number): number {
  const l = Math.max(0, Math.min(MAX_LEVEL, level));
  return Math.min(CAP, l * PER_LEVEL_REDUCTION);
}

export function mitigatedDamage(base: number, level: number): number {
  return Math.max(0, base * (1 - reduction(level)));
}
