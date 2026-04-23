export interface ConduitState {
  activated: boolean;
  prismarineFrameBlocks: number;
}

export const MIN_FRAME_FOR_ATTACK = 42;
export const ATTACK_INTERVAL_TICKS = 80;

export function effectRadius(s: ConduitState): number {
  if (!s.activated) return 0;
  return Math.min(96, 16 * Math.floor(s.prismarineFrameBlocks / 7));
}

export function attacksHostileMobs(s: ConduitState): boolean {
  return s.activated && s.prismarineFrameBlocks >= MIN_FRAME_FOR_ATTACK;
}

export function attackRangeBlocks(s: ConduitState): number {
  return attacksHostileMobs(s) ? 8 : 0;
}
