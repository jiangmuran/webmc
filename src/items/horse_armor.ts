// Horse armor. Leather (3), iron (5), gold (7), diamond (11). Dyed
// leather variants allowed.

export type HorseArmorKind = 'leather' | 'iron' | 'gold' | 'diamond';

export interface HorseArmorDef {
  kind: HorseArmorKind;
  defense: number;
}

export const HORSE_ARMOR_DEFS: Record<HorseArmorKind, HorseArmorDef> = {
  leather: { kind: 'leather', defense: 3 },
  iron: { kind: 'iron', defense: 5 },
  gold: { kind: 'gold', defense: 7 },
  diamond: { kind: 'diamond', defense: 11 },
};

export interface EquippedHorseArmor {
  armor: HorseArmorDef | null;
  dyeRgb?: readonly [number, number, number]; // leather only
}

export function equipHorseArmor(state: EquippedHorseArmor, kind: HorseArmorKind): void {
  state.armor = HORSE_ARMOR_DEFS[kind];
}

export function defenseOf(state: EquippedHorseArmor): number {
  return state.armor?.defense ?? 0;
}

export function dyeLeatherArmor(
  state: EquippedHorseArmor,
  rgb: readonly [number, number, number],
): boolean {
  if (state.armor?.kind !== 'leather') return false;
  state.dyeRgb = rgb;
  return true;
}
