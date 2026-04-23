// Pufferfish inflates in 3 stages when threat approaches; damages + poisons
// entities that touch it. Deflates when threat gone.

export const PUFFER_DETECT_RADIUS = 2;
export const POISON_TICKS = 140;
export const POISON_AMPLIFIER = 1;

export type PufferState = 0 | 1 | 2; // 0 deflated, 1 half, 2 full

export interface PufferCtx {
  state: PufferState;
  threatNearby: boolean;
}

export function transition(c: PufferCtx): PufferCtx {
  if (c.threatNearby) {
    if (c.state < 2) return { ...c, state: (c.state + 1) as PufferState };
    return c;
  }
  if (c.state > 0) return { ...c, state: (c.state - 1) as PufferState };
  return c;
}

export function contactDamage(state: PufferState): number {
  if (state === 0) return 0;
  if (state === 1) return 1;
  return 2;
}

export function contactPoison(state: PufferState): boolean {
  return state >= 1;
}

export function fullyInflated(c: PufferCtx): boolean {
  return c.state === 2;
}
