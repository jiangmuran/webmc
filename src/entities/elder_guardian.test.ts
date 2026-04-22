import { describe, it, expect } from 'vitest';
import { makeElderAura, tickElderAura } from './elder_guardian';

describe('elder guardian aura', () => {
  it('applies mining fatigue III to nearby players', () => {
    const s = makeElderAura();
    const out = tickElderAura(s, {
      elderPos: { x: 0, y: 0, z: 0 },
      players: [{ id: 1, position: { x: 10, y: 0, z: 0 } }],
      dtSec: 0.1,
    });
    expect(out[0]?.amplifier).toBe(2);
    expect(out[0]?.durationSec).toBe(300);
  });

  it('refresh cooldown prevents spam', () => {
    const s = makeElderAura();
    tickElderAura(s, {
      elderPos: { x: 0, y: 0, z: 0 },
      players: [{ id: 1, position: { x: 10, y: 0, z: 0 } }],
      dtSec: 0.1,
    });
    const out = tickElderAura(s, {
      elderPos: { x: 0, y: 0, z: 0 },
      players: [{ id: 1, position: { x: 10, y: 0, z: 0 } }],
      dtSec: 0.1,
    });
    expect(out.length).toBe(0);
  });

  it('players outside 50 block radius skipped', () => {
    const s = makeElderAura();
    const out = tickElderAura(s, {
      elderPos: { x: 0, y: 0, z: 0 },
      players: [{ id: 1, position: { x: 100, y: 0, z: 0 } }],
      dtSec: 0.1,
    });
    expect(out.length).toBe(0);
  });
});
