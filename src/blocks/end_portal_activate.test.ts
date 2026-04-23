import { describe, it, expect } from 'vitest';
import { isActive, eyesMissing, canPlaceEyeAt, REQUIRED_FRAME_COUNT } from './end_portal_activate';

describe('end portal activate', () => {
  const full = Array.from({ length: REQUIRED_FRAME_COUNT }, () => ({ hasEye: true }));
  const eleven = Array.from({ length: 11 }, () => ({ hasEye: true }));

  it('all 12 eyes activates', () => {
    expect(isActive(full)).toBe(true);
  });

  it('wrong count fails', () => {
    expect(isActive(eleven)).toBe(false);
  });

  it('counts missing', () => {
    expect(eyesMissing([{ hasEye: true }, { hasEye: false }])).toBe(1);
  });

  it('empty slot placeable', () => {
    expect(canPlaceEyeAt({ hasEye: false })).toBe(true);
    expect(canPlaceEyeAt({ hasEye: true })).toBe(false);
  });
});
