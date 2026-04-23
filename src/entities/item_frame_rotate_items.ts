export interface ItemFrameState {
  rotationIndex: number;
  heldItem?: string;
  isGlow: boolean;
}

export const ROTATIONS = 8;

export function rotate(s: ItemFrameState): ItemFrameState {
  return { ...s, rotationIndex: (s.rotationIndex + 1) % ROTATIONS };
}

export function comparatorOutput(s: ItemFrameState): number {
  if (!s.heldItem) return 0;
  return s.rotationIndex + 1;
}

export function arrowDropsItem(s: ItemFrameState): string | undefined {
  return s.heldItem;
}
