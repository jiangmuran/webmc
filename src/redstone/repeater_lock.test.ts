import { describe, it, expect } from 'vitest';
import { isLockingSide, makeRepeaterLockState, tickLock } from './repeater_lock';

describe('repeater lock', () => {
  it('no side signal = normal', () => {
    const s = makeRepeaterLockState();
    const r = tickLock(s, { rearSignal: 15, leftSideSignal: 0, rightSideSignal: 0 });
    expect(r.output).toBe(15);
    expect(s.locked).toBe(false);
  });

  it('side signal locks', () => {
    const s = makeRepeaterLockState();
    tickLock(s, { rearSignal: 15, leftSideSignal: 0, rightSideSignal: 0 });
    const r = tickLock(s, { rearSignal: 0, leftSideSignal: 15, rightSideSignal: 0 });
    expect(s.locked).toBe(true);
    expect(r.output).toBe(15); // locked output preserved from last
  });

  it('unlock on side remove', () => {
    const s = makeRepeaterLockState();
    tickLock(s, { rearSignal: 15, leftSideSignal: 15, rightSideSignal: 0 });
    const r = tickLock(s, { rearSignal: 0, leftSideSignal: 0, rightSideSignal: 0 });
    expect(s.locked).toBe(false);
    expect(r.output).toBe(0);
  });

  it('only powered repeater/comparator locks', () => {
    expect(isLockingSide({ block: 'none', powered: true, facesIntoCenter: true })).toBe(false);
    expect(isLockingSide({ block: 'repeater', powered: false, facesIntoCenter: true })).toBe(false);
    expect(isLockingSide({ block: 'repeater', powered: true, facesIntoCenter: false })).toBe(false);
    expect(isLockingSide({ block: 'repeater', powered: true, facesIntoCenter: true })).toBe(true);
  });
});
