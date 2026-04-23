// Tick freeze (debug / cheat). /tick freeze halts world+entity tick;
// /tick step N advances exactly N ticks.

export interface TickClock {
  tick: number;
  frozen: boolean;
  stepsRemaining: number;
}

export function makeClock(): TickClock {
  return { tick: 0, frozen: false, stepsRemaining: 0 };
}

export function advance(c: TickClock): TickClock {
  if (c.frozen && c.stepsRemaining <= 0) return c;
  const remaining = c.frozen ? c.stepsRemaining - 1 : c.stepsRemaining;
  return { ...c, tick: c.tick + 1, stepsRemaining: Math.max(0, remaining) };
}

export function freeze(c: TickClock): TickClock {
  return { ...c, frozen: true, stepsRemaining: 0 };
}

export function unfreeze(c: TickClock): TickClock {
  return { ...c, frozen: false, stepsRemaining: 0 };
}

export function step(c: TickClock, n: number): TickClock {
  return { ...c, stepsRemaining: n };
}

export function isRunning(c: TickClock): boolean {
  return !c.frozen || c.stepsRemaining > 0;
}
