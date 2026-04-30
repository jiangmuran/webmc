export interface ConduitState {
  activated: boolean;
  prismarineFrameBlocks: number;
}

// Wiki (minecraft.wiki/w/Conduit): "When the conduit is at full power
// (frame ≥ 42 prismarine), it damages hostile mobs in water within
// 8 blocks every 2 seconds, dealing 4 damage." Old 80-tick (4 s)
// interval was 2× the wiki value, halving the conduit's DPS against
// underwater hostiles. Sibling conduit_sphere_power.ts already uses
// 40 ticks.
export const MIN_FRAME_FOR_ATTACK = 42;
export const ATTACK_INTERVAL_TICKS = 40;

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
