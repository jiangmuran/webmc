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

// Wiki (minecraft.wiki/w/Witch): "The witch does not attack during
// this time." Drinking takes 1.6 seconds; the witch's offensive
// throws are gated entirely while drinking — outgoing damage is 0,
// not 0.25. Old constant 0.25 implied a 75%-reduced (but still
// active) attack, which contradicts the wiki's "does not attack"
// rule. The witch's defensive *incoming* damage is unchanged here
// (witches still take 85% less magical damage; that's modelled
// elsewhere).
export function attackDamageMultiplierWhileDrinking(): number {
  return 0;
}
