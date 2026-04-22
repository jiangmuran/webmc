import { describe, it, expect } from 'vitest';
import { makeObserver, onBlockChange, tickObserver, watchedOffset } from './observer_pulse';

describe('observer', () => {
  it('starts unpowered', () => {
    expect(makeObserver('north').powered).toBe(false);
  });

  it('fires on block change', () => {
    const o = makeObserver('north');
    expect(onBlockChange(o, { blockInFrontChanged: true })).toBe(true);
    expect(o.powered).toBe(true);
  });

  it('does not double-fire while powered', () => {
    const o = makeObserver('north');
    onBlockChange(o, { blockInFrontChanged: true });
    expect(onBlockChange(o, { blockInFrontChanged: true })).toBe(false);
  });

  it('unpowers after 2 ticks', () => {
    const o = makeObserver('north');
    onBlockChange(o, { blockInFrontChanged: true });
    tickObserver(o);
    const r = tickObserver(o);
    expect(r.justFired).toBe(true);
    expect(o.powered).toBe(false);
  });

  it('up facing watches y+1', () => {
    expect(watchedOffset('up')).toEqual({ dx: 0, dy: 1, dz: 0 });
  });

  it('east faces watches x+1', () => {
    expect(watchedOffset('east')).toEqual({ dx: 1, dy: 0, dz: 0 });
  });
});
