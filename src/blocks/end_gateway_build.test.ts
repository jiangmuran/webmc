import { describe, it, expect } from 'vitest';
import {
  buildGateway,
  gatewayDestination,
  isGatewayConfiguration,
  type GatewayLookup,
} from './end_gateway_build';

describe('end gateway', () => {
  it('detects + pattern of crystals', () => {
    const l: GatewayLookup = { isEndCrystal: () => true };
    expect(isGatewayConfiguration({ x: 0, y: 60, z: 0 }, l)).toBe(true);
  });

  it('rejects missing crystal', () => {
    const l: GatewayLookup = { isEndCrystal: (x) => x !== 1 };
    expect(isGatewayConfiguration({ x: 0, y: 60, z: 0 }, l)).toBe(false);
  });

  it('destination on outer ring', () => {
    const d = gatewayDestination(0);
    expect(Math.hypot(d.x, d.z)).toBeCloseTo(1024, 0);
  });

  it('different indices give different destinations', () => {
    const a = gatewayDestination(0);
    const b = gatewayDestination(5);
    expect(a).not.toEqual(b);
  });

  it('gateway consumes 4 crystals', () => {
    const r = buildGateway({ x: 0, y: 60, z: 0 }, 0);
    expect(r.crystalsConsumed).toBe(4);
  });

  it('beacon beam announces portal', () => {
    expect(buildGateway({ x: 0, y: 60, z: 0 }, 0).beaconBeam).toBe(true);
  });
});
