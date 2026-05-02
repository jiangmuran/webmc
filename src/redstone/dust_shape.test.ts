import { describe, it, expect } from 'vitest';
import {
  CONN_E,
  CONN_N,
  CONN_S,
  CONN_UP_N,
  CONN_W,
  dustShape,
  type DustLookup,
} from './dust_shape';

const EMPTY: DustLookup = {
  receivesPower: () => false,
  isDust: () => false,
  isSolid: () => false,
};

describe('redstone dust shape', () => {
  it('isolated defaults to cross (wiki: + plus sign powers all sides)', () => {
    expect(dustShape(EMPTY).renderKind).toBe('cross');
  });

  it('single-axis = side', () => {
    const l: DustLookup = {
      ...EMPTY,
      isDust: (_, __, dz) => dz === -1,
    };
    const s = dustShape(l);
    expect(s.renderKind).toBe('side');
    expect(s.horizontalMask & CONN_N).toBe(CONN_N);
  });

  it('two-axis = cross', () => {
    const l: DustLookup = {
      ...EMPTY,
      receivesPower: (dx, __, dz) => dx === 1 || dz === -1,
    };
    const s = dustShape(l);
    expect(s.renderKind).toBe('cross');
    expect(s.horizontalMask & CONN_N).toBe(CONN_N);
    expect(s.horizontalMask & CONN_E).toBe(CONN_E);
  });

  it('up-ramp tagged', () => {
    const l: DustLookup = {
      receivesPower: () => false,
      isDust: (_, dy, dz) => dy === 1 && dz === -1,
      isSolid: (_, dy, dz) => dy === 0 && dz === -1,
    };
    const s = dustShape(l);
    expect(s.upMask & CONN_UP_N).toBe(CONN_UP_N);
  });

  it('solid above blocks up-ramp', () => {
    const l: DustLookup = {
      receivesPower: () => false,
      isDust: (_, dy, dz) => dy === 1 && dz === -1,
      isSolid: (_, dy, dz) => (dy === 0 && dz === -1) || (dy === 1 && dz === 0),
    };
    const s = dustShape(l);
    expect(s.upMask).toBe(0);
  });

  it('receivesPower in four cardinals = cross', () => {
    const l: DustLookup = {
      ...EMPTY,
      receivesPower: (dx, _, dz) => Math.abs(dx) + Math.abs(dz) === 1,
    };
    const s = dustShape(l);
    expect(s.renderKind).toBe('cross');
    const allFour = CONN_N | CONN_S | CONN_E | CONN_W;
    expect(s.horizontalMask & allFour).toBe(allFour);
  });
});
