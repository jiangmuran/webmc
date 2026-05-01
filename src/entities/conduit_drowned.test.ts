import { describe, it, expect } from 'vitest';
import {
  CONDUIT_DAMAGE_RADIUS,
  makeConduitAttackState,
  tickConduitAttack,
} from './conduit_drowned';

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

  it('damage range is clamped to 8 blocks per wiki (regardless of caller radius)', () => {
    // Wiki minecraft.wiki/w/Conduit#Mechanics: hostile-mob damage
    // range is fixed at 8 blocks even when the conduit's power range
    // (water-breathing/haste aura) extends to 96 blocks via a large
    // activation frame.
    expect(CONDUIT_DAMAGE_RADIUS).toBe(8);
    const s = makeConduitAttackState();
    const r = tickConduitAttack(s, {
      conduitPos: { x: 0, y: 0, z: 0 },
      radius: 96, // caller passes large power radius
      targets: [
        { id: 1, position: { x: 7, y: 0, z: 0 }, kind: 'drowned' }, // within 8
        { id: 2, position: { x: 9, y: 0, z: 0 }, kind: 'drowned' }, // outside 8
        { id: 3, position: { x: 50, y: 0, z: 0 }, kind: 'guardian' },
      ],
      dtSec: 0.1,
    });
    expect(r.hits.map((h) => h.id)).toEqual([1]);
  });
});
