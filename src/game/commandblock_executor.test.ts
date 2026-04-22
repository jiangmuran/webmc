import { describe, it, expect } from 'vitest';
import { makeCommandBlock, shouldRunThisTick, markRun } from './commandblock_executor';

describe('command block', () => {
  it('impulse runs on rising edge', () => {
    const b = makeCommandBlock('impulse', '/say hi');
    expect(shouldRunThisTick(b, { nowTick: 0, runRiseEdge: true })).toBe('ran');
    expect(shouldRunThisTick(b, { nowTick: 1, runRiseEdge: false })).toBe('no_power');
  });

  it('repeat runs while powered', () => {
    const b = makeCommandBlock('repeat', '/say hi');
    b.poweredInput = true;
    expect(shouldRunThisTick(b, { nowTick: 0, runRiseEdge: false })).toBe('ran');
  });

  it('chain requires prev success', () => {
    const b = makeCommandBlock('chain', '/say hi');
    expect(shouldRunThisTick(b, { nowTick: 0, prevLinkSuccess: true, runRiseEdge: false })).toBe(
      'ran',
    );
    expect(shouldRunThisTick(b, { nowTick: 0, prevLinkSuccess: false, runRiseEdge: false })).toBe(
      'skipped',
    );
  });

  it('conditional skips if prev failed', () => {
    const b = makeCommandBlock('impulse', '/say hi');
    b.conditional = true;
    expect(shouldRunThisTick(b, { nowTick: 0, prevLinkSuccess: false, runRiseEdge: true })).toBe(
      'skipped',
    );
  });

  it('markRun updates state', () => {
    const b = makeCommandBlock('impulse', 'x');
    markRun(b, true, 10);
    expect(b.lastSuccess).toBe(true);
    expect(b.lastRunTick).toBe(10);
  });
});
