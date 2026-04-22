import { describe, it, expect } from 'vitest';
import { makeConduitAttackState, tickConduitAttack } from './conduit_drowned';

describe('conduit attack', () => {
  it('damages drowned/guardians in range', () => {
    const s = makeConduitAttackState();
    const r = tickConduitAttack(s, {
      conduitPos: { x: 0, y: 0, z: 0 },
      radius: 16,
      targets: [
        { id: 1, position: { x: 5, y: 0, z: 0 }, kind: 'drowned' },
        { id: 2, position: { x: 100, y: 0, z: 0 }, kind: 'guardian' },
        { id: 3, position: { x: 2, y: 0, z: 0 }, kind: 'axolotl' },
      ],
      dtSec: 0.1,
    });
    expect(r.hits.map((h) => h.id)).toEqual([1]);
  });

  it('cooldown blocks next attack', () => {
    const s = makeConduitAttackState();
    tickConduitAttack(s, {
      conduitPos: { x: 0, y: 0, z: 0 },
      radius: 16,
      targets: [{ id: 1, position: { x: 5, y: 0, z: 0 }, kind: 'drowned' }],
      dtSec: 0.1,
    });
    const r = tickConduitAttack(s, {
      conduitPos: { x: 0, y: 0, z: 0 },
      radius: 16,
      targets: [{ id: 1, position: { x: 5, y: 0, z: 0 }, kind: 'drowned' }],
      dtSec: 0.1,
    });
    expect(r.hits.length).toBe(0);
  });
});
