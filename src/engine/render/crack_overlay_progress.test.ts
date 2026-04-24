import { describe, it, expect } from 'vitest';
import { crackStage, crackTextureId, CRACK_STAGES } from './crack_overlay_progress';

describe('crack overlay progress', () => {
  it('zero → no stage', () => {
    expect(crackStage(0)).toBe(-1);
  });

  it('half → mid stage', () => {
    expect(crackStage(0.5)).toBe(5);
  });

  it('full → last stage', () => {
    expect(crackStage(1)).toBe(CRACK_STAGES - 1);
  });

  it('over 1 clamps', () => {
    expect(crackStage(999)).toBe(CRACK_STAGES - 1);
  });

  it('no texture at -1', () => {
    expect(crackTextureId(-1)).toBeUndefined();
  });

  it('texture for stage', () => {
    expect(crackTextureId(3)).toContain('destroy_3');
  });
});
