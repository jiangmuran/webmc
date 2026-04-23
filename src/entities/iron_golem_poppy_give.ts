export interface IronGolemState {
  holdingPoppy: boolean;
  poppyHoldTicks: number;
  angryAt?: string;
}

export const POPPY_HOLD_DURATION = 20 * 15;

export function shouldOfferPoppyToVillager(
  hasVillagerChildNear: boolean,
  s: IronGolemState,
): boolean {
  return hasVillagerChildNear && !s.holdingPoppy && s.angryAt === undefined;
}

export function startHoldingPoppy(s: IronGolemState): IronGolemState {
  return { ...s, holdingPoppy: true, poppyHoldTicks: POPPY_HOLD_DURATION };
}

export function tickPoppy(s: IronGolemState): IronGolemState {
  if (!s.holdingPoppy) return s;
  const remaining = Math.max(0, s.poppyHoldTicks - 1);
  if (remaining === 0) return { ...s, holdingPoppy: false, poppyHoldTicks: 0 };
  return { ...s, poppyHoldTicks: remaining };
}
