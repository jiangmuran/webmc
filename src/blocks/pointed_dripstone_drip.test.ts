import { describe, it, expect } from 'vitest';
import {
  fillsCauldron,
  avgFillTicks,
  rollFillThisTick,
  resultingCauldron,
} from './pointed_dripstone_drip';

describe('pointed dripstone drip', () => {
  it('water fills', () => {
    expect(fillsCauldron('water')).toBe(true);
  });

  it('none does not', () => {
    expect(fillsCauldron('none')).toBe(false);
  });

  it('lava slower than water', () => {
    expect(avgFillTicks('lava')).toBeGreaterThan(avgFillTicks('water'));
  });

  it('roll triggers at tiny rand', () => {
    expect(rollFillThisTick('water', () => 0)).toBe(true);
  });

  it('no roll when no fluid', () => {
    expect(rollFillThisTick('none', () => 0)).toBe(false);
  });

  it('result cauldron kind', () => {
    expect(resultingCauldron('water')).toBe('water_cauldron');
    expect(resultingCauldron('lava')).toBe('lava_cauldron');
    expect(resultingCauldron('none')).toBeNull();
  });
});
