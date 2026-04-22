import { describe, it, expect } from 'vitest';
import {
  craftPackedMud,
  dripToClay,
  MUD_SPEED_MULTIPLIER,
  smeltPackedMud,
  speedOnMud,
  tryMuddify,
} from './mud';

describe('mud', () => {
  it('water bottle on dirt = mud', () => {
    const r = tryMuddify({ target: 'webmc:dirt', hasWaterBottle: true });
    expect(r.ok).toBe(true);
    expect(r.converted).toBe('webmc:mud');
  });

  it('no bottle = no change', () => {
    const r = tryMuddify({ target: 'webmc:dirt', hasWaterBottle: false });
    expect(r.ok).toBe(false);
  });

  it('non-dirt targets are ignored', () => {
    const r = tryMuddify({ target: 'webmc:stone', hasWaterBottle: true });
    expect(r.ok).toBe(false);
  });

  it('drip turns lowest mud to clay', () => {
    const r = dripToClay([
      { x: 0, y: 10, z: 0 },
      { x: 0, y: 8, z: 0 },
      { x: 0, y: 12, z: 0 },
    ]);
    expect(r?.y).toBe(8);
  });

  it('packed mud crafts with wheat', () => {
    expect(craftPackedMud({ mud: 1, wheat: 1 })).not.toBeNull();
    expect(craftPackedMud({ mud: 1, wheat: 0 })).toBeNull();
  });

  it('packed mud smelts to brick', () => {
    expect(smeltPackedMud().item).toBe('webmc:mud_brick');
  });

  it('mud slows walker', () => {
    expect(speedOnMud(1)).toBeCloseTo(MUD_SPEED_MULTIPLIER);
  });
});
