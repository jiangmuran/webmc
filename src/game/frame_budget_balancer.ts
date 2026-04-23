export interface FrameBudget {
  targetMs: number;
  usedMs: number;
  carryoverMs: number;
}

export function remaining(b: FrameBudget): number {
  return b.targetMs - b.usedMs + b.carryoverMs;
}

export function nextFrameBudget(b: FrameBudget): FrameBudget {
  const leftover = remaining(b);
  return {
    targetMs: b.targetMs,
    usedMs: 0,
    carryoverMs: Math.max(-b.targetMs, Math.min(b.targetMs, leftover * 0.5)),
  };
}

export function qualityStep(fps: number): 'up' | 'hold' | 'down' {
  if (fps < 20) return 'down';
  if (fps > 50) return 'up';
  return 'hold';
}
