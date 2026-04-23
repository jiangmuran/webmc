export type PotionType = string;

export interface TippedArrowHit {
  potion: PotionType;
  level: number;
  durationTicks: number;
}

export function arrowEffectOnHit(
  arrow: { potion?: PotionType; level: number; durationTicks: number } | undefined,
  wasCritical: boolean,
): TippedArrowHit | undefined {
  if (arrow?.potion === undefined) return undefined;
  const durationTicks = Math.floor(arrow.durationTicks / 8);
  if (durationTicks <= 0) return undefined;
  return {
    potion: arrow.potion,
    level: Math.max(1, arrow.level + (wasCritical ? 1 : 0)),
    durationTicks,
  };
}
