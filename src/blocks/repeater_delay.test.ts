import { describe, it, expect } from 'vitest';
import {
  onPoweredInput,
  tick,
  outputPower,
  lockByPerpendicularRepeater,
  nextDelay,
  type Repeater,
} from './repeater_delay';

function mk(): Repeater {
  return { delaySetting: 2, facing: 'north', locked: false, poweredFor: 0 };
}

describe('repeater delay', () => {
  it('power input sets pending', () => {
    const r = onPoweredInput(mk());
    expect(r.poweredFor).toBe(2);
  });

  it('tick decrements', () => {
    let r: Repeater = { ...mk(), poweredFor: 2 };
    r = tick(r);
    expect(r.poweredFor).toBe(1);
  });

  it('output 15 while pending', () => {
    expect(outputPower({ ...mk(), poweredFor: 1 })).toBe(15);
  });

  it('output 0 when idle', () => {
    expect(outputPower(mk())).toBe(0);
  });

  it('locked ignores input', () => {
    const locked = lockByPerpendicularRepeater(mk(), true);
    expect(onPoweredInput(locked).poweredFor).toBe(0);
  });

  it('delay cycles 1..4', () => {
    let r = mk();
    r = nextDelay(r); // 3
    r = nextDelay(r); // 4
    r = nextDelay(r); // 1
    expect(r.delaySetting).toBe(1);
  });
});
