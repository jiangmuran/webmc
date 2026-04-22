// Frog spawn → tadpoles. Tadpoles mature into frogs over 24000 ticks.
// Need water to survive; suffocate on land.

export interface Tadpole {
  ageTicks: number;
  inWater: boolean;
  outOfWaterTicks: number;
}

export const MATURE_AGE = 24000;
export const MAX_OUT_OF_WATER = 300; // 15s

export function makeTadpole(): Tadpole {
  return { ageTicks: 0, inWater: true, outOfWaterTicks: 0 };
}

export interface TickQuery {
  inWater: boolean;
}

export interface TickResult {
  matured: boolean;
  suffocated: boolean;
}

export function tickTadpole(t: Tadpole, q: TickQuery): TickResult {
  t.inWater = q.inWater;
  if (!q.inWater) {
    t.outOfWaterTicks += 1;
    if (t.outOfWaterTicks >= MAX_OUT_OF_WATER) {
      return { matured: false, suffocated: true };
    }
    return { matured: false, suffocated: false };
  }
  t.outOfWaterTicks = 0;
  t.ageTicks += 1;
  return { matured: t.ageTicks >= MATURE_AGE, suffocated: false };
}

// Bucket: pick up tadpole → water bucket of tadpole.
export function bucketTadpole(_t: Tadpole, hasEmptyBucket: boolean): 'bucketed' | 'no_bucket' {
  return hasEmptyBucket ? 'bucketed' : 'no_bucket';
}
