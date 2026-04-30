// Armadillos drop scutes periodically (every ~5-10 min) or when
// brushed. Wolves wearing scute armor gain damage reduction.

export const SCUTE_DROP_MIN_TICKS = 5 * 60 * 20;
export const SCUTE_DROP_MAX_TICKS = 10 * 60 * 20;

export function rollNextScuteCooldown(rand: () => number): number {
  const r = rand();
  return Math.floor(SCUTE_DROP_MIN_TICKS + r * (SCUTE_DROP_MAX_TICKS - SCUTE_DROP_MIN_TICKS));
}

export function brushYieldsScute(alreadyBrushedWithinTicks: number): boolean {
  return alreadyBrushedWithinTicks >= SCUTE_DROP_MIN_TICKS;
}

// Wiki (minecraft.wiki/w/Wolf_Armor): "Wolf armor absorbs all damage
// done to the wolf with some exceptions (see the list below), until
// its durability runs out." Magic damage is the only major exception
// that bypasses the armor; fire/fall damage IS absorbed. The +11
// armor stat shown on the tooltip is bugged (MC-268913) — actual
// protection is 100% while durability remains. Old constant 0.12
// (12% reduction) was off by a factor of ~8 and didn't model the
// magic-damage carveout or the durability-runs-out cliff.
//
// Durability: 64 per piece (wiki Wolf_Armor infobox).
export const WOLF_ARMOR_MAX_DURABILITY = 64;

export interface WolfArmorDamageQuery {
  raw: number;
  isMagicDamage?: boolean;
  armorDurabilityLeft: number;
}

export function wolfArmoredDamage(q: WolfArmorDamageQuery): {
  damage: number;
  armorDurabilityLeft: number;
} {
  if (q.isMagicDamage === true) {
    return { damage: q.raw, armorDurabilityLeft: q.armorDurabilityLeft };
  }
  if (q.armorDurabilityLeft <= 0) {
    return { damage: q.raw, armorDurabilityLeft: 0 };
  }
  return { damage: 0, armorDurabilityLeft: Math.max(0, q.armorDurabilityLeft - 1) };
}
