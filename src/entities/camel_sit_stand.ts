// Camel. Adults can carry 2 riders; can sit (command) and stand.
// Dashes on jump tap (7-block leap). Sitting blocks dash until stand.

export interface Camel {
  sitting: boolean;
  lastDashMs: number;
  riders: string[]; // up to 2
}

export const DASH_COOLDOWN_MS = 55_000;
export const MAX_RIDERS = 2;

export function makeCamel(): Camel {
  return { sitting: false, lastDashMs: -Infinity, riders: [] };
}

export function sit(c: Camel): void {
  c.sitting = true;
}
export function stand(c: Camel): void {
  c.sitting = false;
}

export function tryMount(c: Camel, riderId: string): boolean {
  if (c.riders.length >= MAX_RIDERS) return false;
  if (c.riders.includes(riderId)) return false;
  c.riders.push(riderId);
  return true;
}

export function dismount(c: Camel, riderId: string): boolean {
  const i = c.riders.indexOf(riderId);
  if (i < 0) return false;
  c.riders.splice(i, 1);
  return true;
}

export interface DashQuery {
  nowMs: number;
  jumpHeld: boolean;
  forward: boolean;
}

export function tryDash(c: Camel, q: DashQuery): boolean {
  if (c.sitting) return false;
  if (!q.jumpHeld || !q.forward) return false;
  if (q.nowMs - c.lastDashMs < DASH_COOLDOWN_MS) return false;
  c.lastDashMs = q.nowMs;
  return true;
}

// Camels tall: mobs under them can't attack unless they can reach.
export const TALLNESS_BLOCKS = 2.375;
