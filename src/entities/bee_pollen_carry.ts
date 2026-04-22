// Bees collect pollen from flowers, carry it home, deposit in hive to
// increase honey level. Bees whose hive is destroyed become homeless.

export interface Bee {
  carryingPollen: boolean;
  homeHiveId: string | null;
  angerTicksRemaining: number;
}

export function makeBee(): Bee {
  return { carryingPollen: false, homeHiveId: null, angerTicksRemaining: 0 };
}

export function collectPollen(b: Bee): boolean {
  if (b.carryingPollen) return false;
  b.carryingPollen = true;
  return true;
}

export interface DepositResult {
  honeyIncrement: number; // 0 or 1
  crops1x1Growth: number; // near-hive crops
}

export function depositAtHive(b: Bee): DepositResult {
  if (!b.carryingPollen) return { honeyIncrement: 0, crops1x1Growth: 0 };
  b.carryingPollen = false;
  return { honeyIncrement: 1, crops1x1Growth: 1 };
}

// Anger tick countdown.
export function tickAnger(b: Bee): void {
  if (b.angerTicksRemaining > 0) b.angerTicksRemaining -= 1;
}

export function anger(b: Bee, durationTicks: number): void {
  b.angerTicksRemaining = Math.max(b.angerTicksRemaining, durationTicks);
}

export function isAngry(b: Bee): boolean {
  return b.angerTicksRemaining > 0;
}
