import { describe, it, expect } from 'vitest';
import { onEntityLand, passable, scheduledResetTicks } from './big_dripleaf_tilt';

describe('big dripleaf tilt', () => {
  it('none → unstable → partial → full', () => {
    expect(onEntityLand('none')).toBe('unstable');
    expect(onEntityLand('unstable')).toBe('partial');
    expect(onEntityLand('partial')).toBe('full');
  });

  it('only full is passable', () => {
    expect(passable('full')).toBe(true);
    expect(passable('partial')).toBe(false);
  });

  it('reset delays positive', () => {
    expect(scheduledResetTicks('full')).toBeGreaterThan(0);
    expect(scheduledResetTicks('none')).toBeGreaterThan(0);
  });
});
