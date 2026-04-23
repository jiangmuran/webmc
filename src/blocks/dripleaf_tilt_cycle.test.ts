import { describe, it, expect } from 'vitest';
import {
  nextTilt,
  collapsesPlayer,
  resetsAfterTick,
  TILT_DELAYS_TICKS,
} from './dripleaf_tilt_cycle';

describe('dripleaf tilt cycle', () => {
  it('none → unstable', () => {
    expect(nextTilt('none')).toBe('unstable');
  });

  it('partial → full', () => {
    expect(nextTilt('partial')).toBe('full');
  });

  it('full stays full', () => {
    expect(nextTilt('full')).toBe('full');
  });

  it('full collapses player', () => {
    expect(collapsesPlayer('full')).toBe(true);
  });

  it('others do not', () => {
    expect(collapsesPlayer('unstable')).toBe(false);
  });

  it('resets after delay', () => {
    expect(resetsAfterTick('full', TILT_DELAYS_TICKS.full)).toBe(true);
  });

  it('no reset during delay', () => {
    expect(resetsAfterTick('full', 10)).toBe(false);
  });
});
