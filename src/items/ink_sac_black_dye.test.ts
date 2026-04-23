import { describe, it, expect } from 'vitest';
import {
  canDyeWool,
  resultingWoolColor,
  signTextColor,
  alsoSourceForBlackDye,
} from './ink_sac_black_dye';

describe('ink sac black dye', () => {
  it('dyes wool', () => {
    expect(canDyeWool()).toBe(true);
    expect(resultingWoolColor()).toBe('black_wool');
  });

  it('signs text black', () => {
    expect(signTextColor()).toBe('black');
  });

  it('craftable to black dye', () => {
    expect(alsoSourceForBlackDye()).toBe(true);
  });
});
