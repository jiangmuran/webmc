import { describe, it, expect } from 'vitest';
import {
  cookTicks,
  acceptsInput,
  xpEmittedMultiplier,
  FURNACE_COOK_TICKS,
} from './blast_furnace_smoker';

describe('blast furnace / smoker', () => {
  it('furnace 200', () => {
    expect(cookTicks('furnace')).toBe(FURNACE_COOK_TICKS);
  });

  it('blast half', () => {
    expect(cookTicks('blast_furnace')).toBe(FURNACE_COOK_TICKS / 2);
  });

  it('smoker half', () => {
    expect(cookTicks('smoker')).toBe(FURNACE_COOK_TICKS / 2);
  });

  it('blast accepts ore only', () => {
    expect(acceptsInput('blast_furnace', 'ore')).toBe(true);
    expect(acceptsInput('blast_furnace', 'food')).toBe(false);
  });

  it('smoker accepts food only', () => {
    expect(acceptsInput('smoker', 'food')).toBe(true);
    expect(acceptsInput('smoker', 'ore')).toBe(false);
  });

  it('furnace accepts all', () => {
    expect(acceptsInput('furnace', 'misc')).toBe(true);
  });

  it('xp multiplier same', () => {
    expect(xpEmittedMultiplier('blast_furnace')).toBe(1);
  });
});
