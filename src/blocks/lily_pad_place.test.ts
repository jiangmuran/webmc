import { describe, it, expect } from 'vitest';
import { canPlace, damagesBoatOnImpact, breakDropsSelf } from './lily_pad_place';

describe('lily pad place', () => {
  it('places on water top face', () => {
    expect(canPlace({ waterBelow: true, topFaceClicked: true, airAboveWater: true })).toBe(true);
  });

  it('fails if no water', () => {
    expect(canPlace({ waterBelow: false, topFaceClicked: true, airAboveWater: true })).toBe(false);
  });

  it('fails if not top face', () => {
    expect(canPlace({ waterBelow: true, topFaceClicked: false, airAboveWater: true })).toBe(false);
  });

  it('boats broken on impact', () => {
    expect(damagesBoatOnImpact()).toBe(true);
  });

  it('drops self', () => {
    expect(breakDropsSelf()).toBe(true);
  });
});
