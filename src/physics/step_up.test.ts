import { describe, it, expect } from 'vitest';
import { shouldStepUp, stepHeightFor, DEFAULT_STEP_HEIGHT } from './step_up';

const base = {
  blockedLow: true,
  clearanceAbove: true,
  verticalClearanceAtStep: 0.5,
  stepHeight: DEFAULT_STEP_HEIGHT,
  onGround: true,
};

describe('step up', () => {
  it('steps when conditions met', () => {
    expect(shouldStepUp(base)).toBe(true);
  });

  it('airborne no step', () => {
    expect(shouldStepUp({ ...base, onGround: false })).toBe(false);
  });

  it('no obstacle no step', () => {
    expect(shouldStepUp({ ...base, blockedLow: false })).toBe(false);
  });

  it('no clearance no step', () => {
    expect(shouldStepUp({ ...base, clearanceAbove: false })).toBe(false);
  });

  it('too tall no step', () => {
    expect(shouldStepUp({ ...base, verticalClearanceAtStep: 2 })).toBe(false);
  });

  it('horse steps higher', () => {
    expect(stepHeightFor('horse')).toBeGreaterThan(stepHeightFor('player'));
  });
});
