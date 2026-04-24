export interface ShulkerBoxAnim {
  ticks: number;
  isOpening: boolean;
  isClosing: boolean;
}

export const OPEN_TICKS = 10;

export function startOpen(_s: ShulkerBoxAnim): ShulkerBoxAnim {
  return { ticks: 0, isOpening: true, isClosing: false };
}

export function startClose(_s: ShulkerBoxAnim): ShulkerBoxAnim {
  return { ticks: 0, isOpening: false, isClosing: true };
}

export function tick(s: ShulkerBoxAnim): ShulkerBoxAnim {
  if (s.ticks >= OPEN_TICKS) return { ...s, isOpening: false, isClosing: false };
  return { ...s, ticks: s.ticks + 1 };
}

export function progress(s: ShulkerBoxAnim): number {
  return Math.min(1, s.ticks / OPEN_TICKS);
}

export function collidesWithPlayer(
  s: ShulkerBoxAnim,
  pushDirection: 'up' | 'down' | 'side',
): boolean {
  return (s.isOpening || s.isClosing) && pushDirection !== 'side';
}
