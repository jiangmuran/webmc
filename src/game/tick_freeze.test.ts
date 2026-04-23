import { describe, it, expect } from 'vitest';
import { makeClock, advance, freeze, unfreeze, step, isRunning } from './tick_freeze';

describe('tick freeze', () => {
  it('runs by default', () => {
    expect(advance(makeClock()).tick).toBe(1);
    expect(isRunning(makeClock())).toBe(true);
  });

  it('freeze halts', () => {
    let c = freeze(makeClock());
    c = advance(c);
    expect(c.tick).toBe(0);
    expect(isRunning(c)).toBe(false);
  });

  it('step advances N', () => {
    let c = step(freeze(makeClock()), 3);
    for (let i = 0; i < 3; i++) c = advance(c);
    expect(c.tick).toBe(3);
  });

  it('step exhausted re-freezes', () => {
    let c = step(freeze(makeClock()), 1);
    c = advance(c);
    c = advance(c);
    expect(c.tick).toBe(1);
  });

  it('unfreeze resumes', () => {
    const c = unfreeze(freeze(makeClock()));
    expect(advance(c).tick).toBe(1);
  });
});
