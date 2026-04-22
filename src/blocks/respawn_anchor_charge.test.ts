import { describe, it, expect } from 'vitest';
import {
  addCharge,
  emissionFor,
  makeRespawnAnchor,
  RESPAWN_ANCHOR_MAX,
  useAnchor,
} from './respawn_anchor_charge';

describe('respawn anchor', () => {
  it('starts at 0 charges', () => {
    expect(makeRespawnAnchor().charges).toBe(0);
  });

  it('clamps initial charges to max', () => {
    expect(makeRespawnAnchor(99).charges).toBe(RESPAWN_ANCHOR_MAX);
  });

  it('addCharge increments up to max', () => {
    const s = makeRespawnAnchor();
    for (let i = 0; i < RESPAWN_ANCHOR_MAX; i++) addCharge(s);
    expect(s.charges).toBe(RESPAWN_ANCHOR_MAX);
    expect(addCharge(s).accepted).toBe(false);
  });

  it('nether + charge = spawn set', () => {
    const s = makeRespawnAnchor(2);
    const r = useAnchor(s, { playerUUID: 'u1', dimension: 'nether' });
    expect(r.status).toBe('spawn_set');
    expect(s.charges).toBe(1);
  });

  it('overworld anchor explodes', () => {
    const s = makeRespawnAnchor(3);
    const r = useAnchor(s, { playerUUID: 'u1', dimension: 'overworld' });
    expect(r.status).toBe('exploded');
    expect(r.explosionPower).toBe(5);
  });

  it('no charge in nether = no spawn set', () => {
    const s = makeRespawnAnchor(0);
    const r = useAnchor(s, { playerUUID: 'u1', dimension: 'nether' });
    expect(r.status).toBe('no_charge');
  });

  it('emission scales 0,3,7,11,15', () => {
    expect(emissionFor(0)).toBe(0);
    expect(emissionFor(2)).toBe(7);
    expect(emissionFor(4)).toBe(15);
  });
});
