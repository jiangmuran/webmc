export interface WitchState {
  hpPercent: number;
  targetIsClose: boolean;
  fireDamageTicks: number;
  insideWater: boolean;
  isDrinking: boolean;
}

export type WitchPotion = 'healing' | 'fire_resistance' | 'water_breathing' | 'swiftness' | 'none';

export function potionToDrink(s: WitchState): WitchPotion {
  if (s.isDrinking) return 'none';
  if (s.hpPercent <= 0.5) return 'healing';
  if (s.fireDamageTicks > 0) return 'fire_resistance';
  if (s.insideWater) return 'water_breathing';
  if (!s.targetIsClose) return 'swiftness';
  return 'none';
}

export function attackDamageMultiplierWhileDrinking(): number {
  return 0.25;
}
