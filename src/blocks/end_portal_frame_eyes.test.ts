import { describe, it, expect } from 'vitest';
import {
  makeEmpty,
  placeEye,
  isComplete,
  completedFraction,
  interiorBlockCount,
} from './end_portal_frame_eyes';

describe('end portal frames', () => {
  it('12 frames', () => {
    const s = makeEmpty();
    expect(s.frames.length).toBe(12);
  });

  it('place eye once per cell', () => {
    const s = makeEmpty();
    expect(placeEye(s, 0)).toBe(true);
    expect(placeEye(s, 0)).toBe(false);
  });

  it('completion', () => {
    const s = makeEmpty();
    for (let i = 0; i < 12; i++) placeEye(s, i);
    expect(isComplete(s)).toBe(true);
    expect(completedFraction(s)).toBe(1);
  });

  it('partial fraction', () => {
    const s = makeEmpty();
    placeEye(s, 0);
    placeEye(s, 3);
    expect(completedFraction(s)).toBeCloseTo(2 / 12);
  });

  it('interior 3x3', () => {
    expect(interiorBlockCount()).toBe(9);
  });
});
