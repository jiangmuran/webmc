// Archaeology brush. Slowly dusts suspicious_sand/gravel; reveals an
// item over 96 ticks (4.8 seconds) of continuous brushing per wiki
// (minecraft.wiki/w/Brush): "It takes 96 game ticks (4.8 seconds)
// to brush a single suspicious block." Old constant was 60 ticks
// (3 sec) — 38% too fast, letting players speedrun archaeology
// digs in 60% of the canon time.

export const BRUSH_DUSTING_TICKS = 96;

export interface BrushState {
  progressTicks: number;
  maxTicks: number;
}

export function onBrushTick(s: BrushState): BrushState {
  if (s.progressTicks >= s.maxTicks) return s;
  return { ...s, progressTicks: s.progressTicks + 1 };
}

export function onBrushStop(s: BrushState): BrushState {
  return { ...s, progressTicks: 0 };
}

export function isComplete(s: BrushState): boolean {
  return s.progressTicks >= s.maxTicks;
}

export function stage(s: BrushState): 0 | 1 | 2 | 3 {
  const pct = s.progressTicks / s.maxTicks;
  if (pct < 0.25) return 0;
  if (pct < 0.5) return 1;
  if (pct < 0.75) return 2;
  return 3;
}
