export type PotionType = string;

export interface TippedArrowHit {
  potion: PotionType;
  level: number;
  durationTicks: number;
}

// Wiki (minecraft.wiki/w/Tipped_Arrow + Arrow#Critical_arrows): tipped
// arrows apply the source potion at 1/8 of its duration and the SAME
// level. Critical hits add bonus damage but do NOT change the potion
// level or duration. Old code bumped the level on critical, which the
// wiki explicitly disclaims.
export function arrowEffectOnHit(
  arrow: { potion?: PotionType; level: number; durationTicks: number } | undefined,
  _wasCritical: boolean,
): TippedArrowHit | undefined {
  if (arrow?.potion === undefined) return undefined;
  const durationTicks = Math.floor(arrow.durationTicks / 8);
  if (durationTicks <= 0) return undefined;
  return {
    potion: arrow.potion,
    level: Math.max(1, arrow.level),
    durationTicks,
  };
}
