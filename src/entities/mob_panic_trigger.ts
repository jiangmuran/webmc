// Passive mob panic. Triggered by taking damage, low hp, seeing a
// hostile mob within 8 blocks, or proximity to lit fire.

export interface PanicState {
  panicUntilMs: number;
  panicSource: 'damage' | 'fire' | 'hostile' | null;
}

export const PANIC_DURATION_MS = 5000;
export const HOSTILE_PANIC_RADIUS = 8;
export const FIRE_PANIC_RADIUS = 3;

export function makePanicState(): PanicState {
  return { panicUntilMs: 0, panicSource: null };
}

export interface PanicCheck {
  nowMs: number;
  tookDamage: boolean;
  nearestHostileDistance: number | null;
  nearestFireDistance: number | null;
}

export function updatePanic(s: PanicState, q: PanicCheck): void {
  if (q.tookDamage) {
    s.panicUntilMs = q.nowMs + PANIC_DURATION_MS;
    s.panicSource = 'damage';
    return;
  }
  if (q.nearestHostileDistance !== null && q.nearestHostileDistance <= HOSTILE_PANIC_RADIUS) {
    s.panicUntilMs = Math.max(s.panicUntilMs, q.nowMs + PANIC_DURATION_MS);
    s.panicSource = 'hostile';
    return;
  }
  if (q.nearestFireDistance !== null && q.nearestFireDistance <= FIRE_PANIC_RADIUS) {
    s.panicUntilMs = Math.max(s.panicUntilMs, q.nowMs + PANIC_DURATION_MS);
    s.panicSource = 'fire';
  }
}

export function isPanicking(s: PanicState, nowMs: number): boolean {
  return nowMs < s.panicUntilMs;
}

// Panic speed boost.
export const PANIC_SPEED_MULT = 1.25;

export function speedMultiplier(s: PanicState, nowMs: number): number {
  return isPanicking(s, nowMs) ? PANIC_SPEED_MULT : 1;
}
