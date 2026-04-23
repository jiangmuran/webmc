export interface KBCtx {
  incomingForce: number;
  resistance: number;
  wearingArmor: boolean;
}

export function finalKnockback(c: KBCtx): number {
  const resist = Math.max(0, Math.min(1, c.resistance));
  const reduced = c.incomingForce * (1 - resist);
  return c.wearingArmor ? reduced * 0.9 : reduced;
}

export function isImmune(c: KBCtx): boolean {
  return c.resistance >= 1;
}
