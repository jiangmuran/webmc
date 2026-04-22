import { describe, it, expect } from 'vitest';
import { activatorRailEffect, detectorRailSignal, poweredRailEffect } from './rails';

describe('powered rail', () => {
  it('accelerates with power + cart', () => {
    const r = poweredRailEffect({ hasPower: true, hasCartOnTop: true });
    expect(r.accelerate).toBe(true);
    expect(r.brakes).toBe(false);
  });

  it('brakes without power', () => {
    const r = poweredRailEffect({ hasPower: false, hasCartOnTop: true });
    expect(r.accelerate).toBe(false);
    expect(r.brakes).toBe(true);
  });

  it('no-op without cart', () => {
    const r = poweredRailEffect({ hasPower: true, hasCartOnTop: false });
    expect(r.accelerate).toBe(false);
    expect(r.brakes).toBe(false);
  });
});

describe('detector rail', () => {
  it('signal 15 under cart', () => {
    expect(detectorRailSignal(true)).toBe(15);
    expect(detectorRailSignal(false)).toBe(0);
  });
});

describe('activator rail', () => {
  it('powered + tnt primes fuse', () => {
    const e = activatorRailEffect({ hasPower: true, cartVariant: 'tnt' });
    expect(e.primeTnt).toBe(true);
    expect(e.ejectRider).toBe(true);
  });

  it('powered + hopper disables pickup', () => {
    const e = activatorRailEffect({ hasPower: true, cartVariant: 'hopper' });
    expect(e.disableHopper).toBe(true);
  });

  it('unpowered → no effect', () => {
    const e = activatorRailEffect({ hasPower: false, cartVariant: 'tnt' });
    expect(e.primeTnt).toBe(false);
    expect(e.ejectRider).toBe(false);
  });
});
