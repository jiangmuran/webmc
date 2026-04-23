export interface ShulkerState {
  peekAmount: number;
  attachedFace: 'up' | 'down' | 'north' | 'south' | 'east' | 'west';
  openTicks: number;
}

export const MAX_PEEK = 1;
export const OPEN_ANIMATION_TICKS = 20;

export function isOpening(s: ShulkerState): boolean {
  return s.peekAmount > 0 && s.peekAmount < MAX_PEEK;
}

export function canBeHitByArrow(s: ShulkerState): boolean {
  return s.peekAmount >= MAX_PEEK;
}

export function tickOpen(s: ShulkerState): ShulkerState {
  const next = Math.min(MAX_PEEK, s.peekAmount + MAX_PEEK / OPEN_ANIMATION_TICKS);
  return { ...s, peekAmount: next, openTicks: s.openTicks + 1 };
}
