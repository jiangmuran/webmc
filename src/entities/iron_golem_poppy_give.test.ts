import { describe, it, expect } from 'vitest';
import {
  shouldOfferPoppyToVillager,
  startHoldingPoppy,
  tickPoppy,
  POPPY_HOLD_DURATION,
} from './iron_golem_poppy_give';

describe('iron golem poppy', () => {
  it('offers when child near', () => {
    expect(shouldOfferPoppyToVillager(true, { holdingPoppy: false, poppyHoldTicks: 0 })).toBe(true);
  });

  it('no offer if angry', () => {
    expect(
      shouldOfferPoppyToVillager(true, {
        holdingPoppy: false,
        poppyHoldTicks: 0,
        angryAt: 'zombie',
      }),
    ).toBe(false);
  });

  it('no offer if already holding', () => {
    expect(
      shouldOfferPoppyToVillager(true, {
        holdingPoppy: true,
        poppyHoldTicks: POPPY_HOLD_DURATION,
      }),
    ).toBe(false);
  });

  it('start holding', () => {
    const s = startHoldingPoppy({ holdingPoppy: false, poppyHoldTicks: 0 });
    expect(s.holdingPoppy).toBe(true);
    expect(s.poppyHoldTicks).toBe(POPPY_HOLD_DURATION);
  });

  it('tick drops when elapsed', () => {
    const s = tickPoppy({ holdingPoppy: true, poppyHoldTicks: 1 });
    expect(s.holdingPoppy).toBe(false);
  });

  it('tick decrements', () => {
    expect(tickPoppy({ holdingPoppy: true, poppyHoldTicks: 100 }).poppyHoldTicks).toBe(99);
  });
});
