import { describe, it, expect } from 'vitest';
import { toggle, power, canAttachTo } from './lever_toggle';

describe('lever toggle', () => {
  it('flips state', () => {
    expect(toggle({ powered: false, lastToggledTick: 0 }, 10).powered).toBe(true);
  });

  it('power from state', () => {
    expect(power({ powered: true, lastToggledTick: 0 })).toBe(15);
    expect(power({ powered: false, lastToggledTick: 0 })).toBe(0);
  });

  it('attaches anywhere', () => {
    expect(canAttachTo('wall')).toBe(true);
    expect(canAttachTo('ceiling')).toBe(true);
  });
});
