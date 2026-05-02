export interface ConduitCtx {
  prismarineBlockCount: number;
  inWaterOrWaterlogged: boolean;
}

export const MIN_FRAME = 16;
export const POWER_FULL = 42;

export function isActive(c: ConduitCtx): boolean {
  return c.inWaterOrWaterlogged && c.prismarineBlockCount >= MIN_FRAME;
}

// Wiki (minecraft.wiki/w/Conduit): "The effective radius is 16
// blocks for every seven blocks in the frame, though the effect
// does not activate until the minimum of 16 blocks." Wiki canonical
// breakpoints: 16→32, 21→48, 28→64, 35→80, 42→96.
//
// Old `floor((blocks / 42) * 96)` matched wiki for ≥21 blocks but
// returned 36 for the minimum 16-block frame (wiki: 32) — a step
// discontinuity. Rebased to the canonical
// `floor(blocks / 7) * 16` so all five wiki rows are exact.
export function conduitPowerRange(c: ConduitCtx): number {
  if (!isActive(c)) return 0;
  return Math.min(96, Math.floor(c.prismarineBlockCount / 7) * 16);
}

export function attacksHostiles(c: ConduitCtx): boolean {
  return c.prismarineBlockCount >= POWER_FULL && c.inWaterOrWaterlogged;
}
