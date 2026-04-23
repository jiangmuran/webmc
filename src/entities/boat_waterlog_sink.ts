export interface BoatState {
  hp: number;
  inWater: boolean;
}

export const HP_MAX = 10;

export function regenHpTick(b: BoatState): BoatState {
  if (b.hp >= HP_MAX) return b;
  return { ...b, hp: b.hp + 0.1 };
}

export function takeDamage(b: BoatState, amount: number): BoatState {
  const hp = b.hp - amount;
  return { ...b, hp: Math.max(0, hp) };
}

export function isBroken(b: BoatState): boolean {
  return b.hp <= 0;
}
