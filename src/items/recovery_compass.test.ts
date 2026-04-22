import { describe, it, expect } from 'vitest';
import { craftRecoveryCompass, recordDeath, recoveryCompassReading } from './recovery_compass';

describe('recovery compass', () => {
  it('spins when no death recorded', () => {
    const r = recoveryCompassReading({
      holderPos: { x: 0, y: 0, z: 0 },
      holderDimension: 'overworld',
      lastDeath: null,
    });
    expect(r.valid).toBe(false);
  });

  it('spins when wrong dimension', () => {
    const r = recoveryCompassReading({
      holderPos: { x: 0, y: 0, z: 0 },
      holderDimension: 'nether',
      lastDeath: { pos: { x: 0, y: 0, z: 0 }, dimension: 'overworld' },
    });
    expect(r.valid).toBe(false);
  });

  it('points at death pos in correct dimension', () => {
    const r = recoveryCompassReading({
      holderPos: { x: 0, y: 0, z: 0 },
      holderDimension: 'overworld',
      lastDeath: { pos: { x: 10, y: 0, z: 0 }, dimension: 'overworld' },
    });
    expect(r.valid).toBe(true);
    expect(r.pointingYawRad).toBeCloseTo(0);
  });

  it('crafts with 8 shards + compass', () => {
    expect(craftRecoveryCompass({ echoShards: 8, compasses: 1 })).not.toBeNull();
    expect(craftRecoveryCompass({ echoShards: 7, compasses: 1 })).toBeNull();
  });

  it('records newest death, overwriting previous', () => {
    const d = recordDeath(
      { pos: { x: 1, y: 1, z: 1 }, dimension: 'overworld' },
      { x: 5, y: 5, z: 5 },
      'nether',
    );
    expect(d).toEqual({ pos: { x: 5, y: 5, z: 5 }, dimension: 'nether' });
  });
});
