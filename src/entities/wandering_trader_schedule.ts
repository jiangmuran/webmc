// Wandering trader spawns periodically near a village meeting point.
// Stays ~40 minutes; disappears (with its 2 llamas) after timer.

export const TRADER_CHECK_INTERVAL_TICKS = 24000;
export const TRADER_LIFETIME_TICKS = 40 * 60 * 20;
export const TRADER_SPAWN_CHANCE_PER_CHECK = 0.025;

export interface TraderTimer {
  ticksUntilNextCheck: number;
  activeTrader: { spawnedAtTick: number } | null;
}

export function makeTimer(): TraderTimer {
  return { ticksUntilNextCheck: TRADER_CHECK_INTERVAL_TICKS, activeTrader: null };
}

export function tick(
  t: TraderTimer,
  nowTick: number,
  rand: () => number,
  canSpawn: boolean,
): TraderTimer {
  if (t.activeTrader && nowTick - t.activeTrader.spawnedAtTick >= TRADER_LIFETIME_TICKS) {
    return { ticksUntilNextCheck: TRADER_CHECK_INTERVAL_TICKS, activeTrader: null };
  }
  if (t.ticksUntilNextCheck > 0) {
    return { ...t, ticksUntilNextCheck: t.ticksUntilNextCheck - 1 };
  }
  if (canSpawn && !t.activeTrader && rand() < TRADER_SPAWN_CHANCE_PER_CHECK) {
    return {
      ticksUntilNextCheck: TRADER_CHECK_INTERVAL_TICKS,
      activeTrader: { spawnedAtTick: nowTick },
    };
  }
  return { ...t, ticksUntilNextCheck: TRADER_CHECK_INTERVAL_TICKS };
}

export function llamaCompanionCount(): number {
  return 2;
}
