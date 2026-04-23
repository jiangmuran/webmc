import { describe, it, expect } from 'vitest';
import { dustShape, hasUpward, type DustConnections } from './redstone_dust_shape';

const none: DustConnections = { north: 'none', south: 'none', east: 'none', west: 'none' };

describe('redstone dust shape', () => {
  it('isolated dot', () => {
    expect(dustShape(none)).toBe('dot');
  });

  it('straight NS line', () => {
    expect(dustShape({ ...none, north: 'side', south: 'side' })).toBe('line_ns');
  });

  it('straight EW line', () => {
    expect(dustShape({ ...none, east: 'side', west: 'side' })).toBe('line_ew');
  });

  it('cross at full four', () => {
    expect(dustShape({ north: 'side', south: 'side', east: 'side', west: 'side' })).toBe('cross');
  });

  it('elbow on turn', () => {
    expect(dustShape({ ...none, north: 'side', east: 'side' })).toBe('elbow');
  });

  it('upward flag', () => {
    expect(hasUpward({ ...none, north: 'up' })).toBe(true);
    expect(hasUpward(none)).toBe(false);
  });
});
