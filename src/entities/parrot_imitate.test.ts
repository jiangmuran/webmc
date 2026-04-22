import { describe, it, expect } from 'vitest';
import { pickMimicSound, dances, canPerch, MIMIC_RADIUS } from './parrot_imitate';

describe('parrot mimic', () => {
  it('no hostile = no sound', () => {
    expect(pickMimicSound({ nearestHostile: null, distance: 5, rand: () => 0 })).toBeNull();
  });

  it('in range + low roll = sound', () => {
    const s = pickMimicSound({ nearestHostile: 'zombie', distance: 5, rand: () => 0 });
    expect(s).toContain('parrot.imitate.zombie');
  });

  it('out of range', () => {
    expect(
      pickMimicSound({ nearestHostile: 'zombie', distance: MIMIC_RADIUS + 1, rand: () => 0 }),
    ).toBeNull();
  });

  it('dances near jukebox', () => {
    expect(dances({ withinJukeboxRange: true })).toBe(true);
    expect(dances({ withinJukeboxRange: false })).toBe(false);
  });

  it('perch requires tame + space', () => {
    expect(canPerch({ tame: true, playerHasOpenShoulder: true, withinDistance: 1 })).toBe(true);
    expect(canPerch({ tame: false, playerHasOpenShoulder: true, withinDistance: 1 })).toBe(false);
  });
});
