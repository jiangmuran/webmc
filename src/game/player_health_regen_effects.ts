export interface PlayerCtx {
  hp: number;
  maxHp: number;
  hasRegeneration: boolean;
  regenAmplifier: number;
  ticksSinceLastRegen: number;
}

export function regenIntervalTicks(amplifier: number): number {
  return Math.max(1, Math.floor(50 / (amplifier + 1)));
}

export function shouldApplyRegen(p: PlayerCtx): boolean {
  if (!p.hasRegeneration) return false;
  if (p.hp >= p.maxHp) return false;
  return p.ticksSinceLastRegen >= regenIntervalTicks(p.regenAmplifier);
}

export function heartsPerSecond(amplifier: number): number {
  return 20 / regenIntervalTicks(amplifier);
}
