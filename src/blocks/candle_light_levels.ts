export function lightPerCandle(count: number): number {
  return Math.max(0, Math.min(12, count * 3));
}

export function triggersCakeAnimation(isOnCake: boolean, lit: boolean): boolean {
  return isOnCake && lit;
}

export function needsWaxingToPreserveColor(): boolean {
  return false;
}
