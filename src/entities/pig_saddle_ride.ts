export interface PigRider {
  saddled: boolean;
  holdingCarrotOnStick: boolean;
  boostTicks: number;
}

export const MAX_BOOST_TICKS = 100;

export function canRide(p: PigRider): boolean {
  return p.saddled;
}

export function speedMult(p: PigRider): number {
  if (!p.saddled) return 1;
  if (p.boostTicks > 0) return 1.4;
  return 1;
}

export function startBoost(p: PigRider): PigRider {
  if (!p.holdingCarrotOnStick) return p;
  return { ...p, boostTicks: MAX_BOOST_TICKS };
}
