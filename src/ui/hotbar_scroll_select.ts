export const HOTBAR_SIZE = 9;

export function scrolled(current: number, delta: number): number {
  const raw = current + Math.sign(delta);
  return ((raw % HOTBAR_SIZE) + HOTBAR_SIZE) % HOTBAR_SIZE;
}

export function bySlotKey(key: string): number | undefined {
  if (key.length !== 1) return undefined;
  const n = Number(key);
  if (!Number.isInteger(n) || n < 1 || n > 9) return undefined;
  return n - 1;
}
