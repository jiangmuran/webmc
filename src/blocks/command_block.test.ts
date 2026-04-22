import { describe, it, expect } from 'vitest';
import { makeCommandBlock, recordResult, tickCommandBlock } from './command_block';

describe('command block', () => {
  it('impulse fires on rising edge', () => {
    const b = makeCommandBlock('impulse', 'say hi');
    const r = tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    expect(r.shouldRun).toBe(true);
  });

  it('impulse does not re-fire while powered', () => {
    const b = makeCommandBlock('impulse', 'say hi');
    tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    const r2 = tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    expect(r2.shouldRun).toBe(false);
  });

  it('repeating runs every tick while powered', () => {
    const b = makeCommandBlock('repeating', 'give diamond');
    const r1 = tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    const r2 = tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    expect(r1.shouldRun).toBe(true);
    expect(r2.shouldRun).toBe(true);
  });

  it('chain runs iff previous succeeded', () => {
    const b = makeCommandBlock('chain', 'x');
    const r = tickCommandBlock(b, { redstonePowered: false, prevBlockSuccess: true });
    expect(r.shouldRun).toBe(true);
    const r2 = tickCommandBlock(b, { redstonePowered: false, prevBlockSuccess: false });
    expect(r2.shouldRun).toBe(false);
  });

  it('conditional blocks prev success', () => {
    const b = makeCommandBlock('repeating', 'y');
    b.conditional = true;
    const r = tickCommandBlock(b, { redstonePowered: true, prevBlockSuccess: false });
    expect(r.shouldRun).toBe(false);
  });

  it('recordResult updates state', () => {
    const b = makeCommandBlock('impulse', 'x');
    recordResult(b, true, 'hello');
    expect(b.lastOutput).toBe('hello');
    expect(b.lastExecutionSucceeded).toBe(true);
  });
});
