export type SkinPart =
  | 'cape'
  | 'jacket'
  | 'left_sleeve'
  | 'right_sleeve'
  | 'left_pants'
  | 'right_pants'
  | 'hat';

export interface SkinPartsBitmask {
  mask: number;
}

export const PART_BITS: Record<SkinPart, number> = {
  cape: 1 << 0,
  jacket: 1 << 1,
  left_sleeve: 1 << 2,
  right_sleeve: 1 << 3,
  left_pants: 1 << 4,
  right_pants: 1 << 5,
  hat: 1 << 6,
};

export function enable(mask: number, part: SkinPart): number {
  return mask | PART_BITS[part];
}

export function disable(mask: number, part: SkinPart): number {
  return mask & ~PART_BITS[part];
}

export function isEnabled(mask: number, part: SkinPart): boolean {
  return (mask & PART_BITS[part]) !== 0;
}

export function enabledParts(mask: number): readonly SkinPart[] {
  return (Object.keys(PART_BITS) as SkinPart[]).filter((p) => isEnabled(mask, p));
}

export const DEFAULT_ALL_ENABLED = Object.values(PART_BITS).reduce((s, b) => s | b, 0);
