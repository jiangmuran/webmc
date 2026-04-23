import { describe, it, expect } from 'vitest';
import { stageForProgress, textureIdForStage, BREAK_STAGES } from './block_breaking_overlay';

describe('block breaking overlay', () => {
  it('no progress hidden', () => {
    expect(stageForProgress(0)).toBe(-1);
  });

  it('half progress mid stage', () => {
    expect(stageForProgress(0.5)).toBe(5);
  });

  it('done last stage', () => {
    expect(stageForProgress(1)).toBe(BREAK_STAGES - 1);
  });

  it('texture id for stage', () => {
    expect(textureIdForStage(3)).toContain('destroy_stage_3');
  });

  it('no texture when hidden', () => {
    expect(textureIdForStage(-1)).toBeUndefined();
  });
});
