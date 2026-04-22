import { describe, it, expect } from 'vitest';
import {
  lightLevel,
  pickAxisFromClick,
  canWaterlog,
  renderHeightBlocks,
  END_ROD_LIGHT,
} from './end_rod_light';

describe('end rod', () => {
  it('light 14', () => {
    expect(lightLevel()).toBe(14);
    expect(END_ROD_LIGHT).toBe(14);
  });

  it('orients from click normal', () => {
    expect(pickAxisFromClick('+y')).toBe('+y');
    expect(pickAxisFromClick('-x')).toBe('-x');
  });

  it('can waterlog', () => {
    expect(canWaterlog()).toBe(true);
  });

  it('full block height', () => {
    expect(renderHeightBlocks()).toBe(1);
  });
});
