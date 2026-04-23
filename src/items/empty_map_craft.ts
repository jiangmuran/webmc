export interface Recipe {
  paperSlots: number;
  compassSlots: number;
  useLocator: boolean;
}

export const PAPER_REQUIRED = 8;
export const COMPASS_REQUIRED = 1;

export function canCraftEmptyMap(r: Recipe): boolean {
  const needsCompass = r.useLocator;
  if (r.paperSlots < PAPER_REQUIRED) return false;
  if (needsCompass && r.compassSlots < COMPASS_REQUIRED) return false;
  return true;
}

export function initialMapScale(): number {
  return 1;
}
