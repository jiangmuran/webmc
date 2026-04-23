export interface Bee {
  angerTicks: number;
  stung: boolean;
}

export const ANGER_AFTER_ATTACK = 400;

export function onPlayerAttack(b: Bee): Bee {
  return { ...b, angerTicks: ANGER_AFTER_ATTACK };
}

export function stingTarget(b: Bee): Bee {
  return { ...b, stung: true, angerTicks: 0 };
}

export function diesSoonAfterSting(b: Bee): boolean {
  return b.stung;
}

export function fleeAfterSting(b: Bee): boolean {
  return b.stung;
}
