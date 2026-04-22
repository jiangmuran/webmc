import { describe, it, expect } from 'vitest';
import {
  tickStrider,
  isShivering,
  moveSpeed,
  ridingSpeed,
  canBeLeashed,
  COLD_THRESHOLD,
} from './strider_warmup';

describe('strider', () => {
  it('in lava not shivering', () => {
    const s = { inLava: true, saddled: false, pupAgeTicks: 0, coldTicks: 100 };
    tickStrider(s);
    expect(isShivering(s)).toBe(false);
  });

  it('out of lava eventually shivers', () => {
    const s = { inLava: false, saddled: false, pupAgeTicks: 0, coldTicks: 0 };
    for (let i = 0; i < COLD_THRESHOLD; i++) tickStrider(s);
    expect(isShivering(s)).toBe(true);
  });

  it('lava fastest', () => {
    const lava = { inLava: true, saddled: false, pupAgeTicks: 0, coldTicks: 0 };
    const shivering = { inLava: false, saddled: false, pupAgeTicks: 0, coldTicks: 50 };
    expect(moveSpeed(lava)).toBeGreaterThan(moveSpeed(shivering));
  });

  it('warped fungus on stick boosts', () => {
    const s = { inLava: true, saddled: true, pupAgeTicks: 0, coldTicks: 0 };
    expect(ridingSpeed(s, true)).toBeGreaterThan(ridingSpeed(s, false));
  });

  it('pup cannot be leashed', () => {
    expect(canBeLeashed({ inLava: true, saddled: false, pupAgeTicks: 100, coldTicks: 0 })).toBe(
      false,
    );
    expect(canBeLeashed({ inLava: true, saddled: false, pupAgeTicks: 0, coldTicks: 0 })).toBe(true);
  });
});
