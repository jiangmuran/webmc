// Thunder and lightning effects. Thunder-chance is modifier of rain
// chance. Lightning struck entities may convert (pig → zombified piglin,
// villager → witch, creeper → charged).

export interface ThunderCtx {
  isRaining: boolean;
  rand: () => number;
}

export const THUNDERSTORM_PROBABILITY_GIVEN_RAIN = 0.1;

export function isThunderstorm(c: ThunderCtx): boolean {
  if (!c.isRaining) return false;
  return c.rand() < THUNDERSTORM_PROBABILITY_GIVEN_RAIN;
}

export type StrikeOutcome =
  | { kind: 'convert'; into: string }
  | { kind: 'charge_creeper' }
  | { kind: 'damage'; amount: number };

export function onLightningStrike(entityType: string): StrikeOutcome {
  if (entityType === 'creeper') return { kind: 'charge_creeper' };
  if (entityType === 'pig') return { kind: 'convert', into: 'zombified_piglin' };
  if (entityType === 'villager') return { kind: 'convert', into: 'witch' };
  if (entityType === 'mooshroom') return { kind: 'convert', into: 'mooshroom_brown' };
  return { kind: 'damage', amount: 5 };
}

export function ignitesBlockAt(isTreetop: boolean): boolean {
  return isTreetop;
}
