import { describe, it, expect } from 'vitest';
import { nextStage, pistonDestroys, dropsSelfOnBreak, canGrow } from './budding_amethyst';

describe('budding amethyst', () => {
  it('stage progression', () => {
    expect(nextStage('small')).toBe('medium');
    expect(nextStage('medium')).toBe('large');
    expect(nextStage('large')).toBe('cluster');
  });

  it('cluster stays', () => {
    expect(nextStage('cluster')).toBe('cluster');
  });

  it('piston destroys (no push)', () => {
    expect(pistonDestroys()).toBe(true);
  });

  it('does not drop self', () => {
    expect(dropsSelfOnBreak()).toBe(false);
  });

  it('grows on air/water with luck', () => {
    expect(canGrow(true, () => 0)).toBe(true);
    expect(canGrow(false, () => 0)).toBe(false);
    expect(canGrow(true, () => 0.99)).toBe(false);
  });
});
