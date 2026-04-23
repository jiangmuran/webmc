import { describe, it, expect } from 'vitest';
import { stageFor, animationFrame, STAGE_3_TICKS } from './bow_charge_stages';

describe('bow charge stages', () => {
  it('not pulling = none', () => {
    expect(stageFor(20, false)).toBe('none');
  });

  it('start stage 0', () => {
    expect(stageFor(0, true)).toBe('pulling_0');
  });

  it('middle stage 1', () => {
    expect(stageFor(5, true)).toBe('pulling_1');
  });

  it('full draw stage 2', () => {
    expect(stageFor(STAGE_3_TICKS, true)).toBe('pulling_2');
  });

  it('frame numbers progress', () => {
    expect(animationFrame('pulling_2')).toBeGreaterThan(animationFrame('pulling_0'));
    expect(animationFrame('none')).toBe(0);
  });
});
