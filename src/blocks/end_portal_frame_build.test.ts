import { describe, it, expect } from 'vitest';
import { isComplete, portalFrameCoordinates, type Frame } from './end_portal_frame_build';

function mkFrames(eyes: number): (Frame | undefined)[] {
  return Array.from({ length: 12 }, (_, i) => ({
    hasEye: i < eyes,
    facing: 'north' as const,
  }));
}

describe('end portal frame build', () => {
  it('12 eyes activates', () => {
    expect(isComplete(mkFrames(12))).toBe(true);
  });

  it('11 eyes incomplete', () => {
    expect(isComplete(mkFrames(11))).toBe(false);
  });

  it('wrong count rejected', () => {
    expect(isComplete(mkFrames(12).slice(0, 10))).toBe(false);
  });

  it('12 frame coordinates', () => {
    expect(portalFrameCoordinates(0, 64, 0)).toHaveLength(12);
  });
});
