import { describe, it, expect } from 'vitest';
import { canStepUp, stepAmount } from './entity_step_up_height';

describe('entity step up height', () => {
  it('small step up', () => {
    expect(
      canStepUp({ entityHeightStep: 0.6, blockInFrontTop: 1.5, entityFeetY: 1, onGround: true }),
    ).toBe(true);
  });

  it('too tall no step', () => {
    expect(
      canStepUp({ entityHeightStep: 0.6, blockInFrontTop: 2.5, entityFeetY: 1, onGround: true }),
    ).toBe(false);
  });

  it('airborne no step', () => {
    expect(
      canStepUp({ entityHeightStep: 0.6, blockInFrontTop: 1.5, entityFeetY: 1, onGround: false }),
    ).toBe(false);
  });

  it('step amount', () => {
    expect(
      stepAmount({ entityHeightStep: 1, blockInFrontTop: 2, entityFeetY: 1.5, onGround: true }),
    ).toBeCloseTo(0.5);
  });
});
