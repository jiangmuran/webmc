import { describe, it, expect } from 'vitest';
import {
  activateLine,
  cutTripwire,
  makeHook,
  validLineBetween,
  type TripwireLine,
} from './tripwire';

describe('tripwire', () => {
  it('hook starts unattached and unpowered', () => {
    const h = makeHook('north');
    expect(h.attached).toBe(false);
    expect(h.powered).toBe(false);
  });

  it('opposite facings along z line is valid', () => {
    expect(
      validLineBetween(
        { pos: { x: 0, y: 0, z: 0 }, facing: 'north' },
        { pos: { x: 0, y: 0, z: -4 }, facing: 'south' },
      ),
    ).toBe(true);
  });

  it('wrong facings invalid', () => {
    expect(
      validLineBetween(
        { pos: { x: 0, y: 0, z: 0 }, facing: 'north' },
        { pos: { x: 0, y: 0, z: -4 }, facing: 'east' },
      ),
    ).toBe(false);
  });

  it('too far is invalid', () => {
    expect(
      validLineBetween(
        { pos: { x: 0, y: 0, z: 0 }, facing: 'east' },
        { pos: { x: 100, y: 0, z: 0 }, facing: 'west' },
      ),
    ).toBe(false);
  });

  it('stepping on wire powers both hooks', () => {
    const line: TripwireLine = {
      hookA: { pos: { x: 0, y: 0, z: 0 }, facing: 'north' },
      hookB: { pos: { x: 0, y: 0, z: -4 }, facing: 'south' },
      stringLen: 3,
      entityOnWire: false,
    };
    const r = activateLine(line, true);
    expect(r.hookAPowered).toBe(true);
    expect(r.hookBPowered).toBe(true);
  });

  it('shears cut without triggering', () => {
    const line: TripwireLine = {
      hookA: { pos: { x: 0, y: 0, z: 0 }, facing: 'north' },
      hookB: { pos: { x: 0, y: 0, z: -4 }, facing: 'south' },
      stringLen: 3,
      entityOnWire: false,
    };
    const r = cutTripwire(line, true);
    expect(r.triggered).toBe(false);
    expect(r.droppedString).toBe(3);
  });

  it('breaking by hand triggers', () => {
    const line: TripwireLine = {
      hookA: { pos: { x: 0, y: 0, z: 0 }, facing: 'north' },
      hookB: { pos: { x: 0, y: 0, z: -4 }, facing: 'south' },
      stringLen: 3,
      entityOnWire: false,
    };
    expect(cutTripwire(line, false).triggered).toBe(true);
  });
});
