import { describe, it, expect } from 'vitest';
import { LLAMA_SPIT_DAMAGE, makeLlamaSpit, tickLlamaSpit } from './llama_spit';

describe('llama spit', () => {
  it('flies forward', () => {
    const s = makeLlamaSpit({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    tickLlamaSpit(s, { isSolid: () => false, dtSec: 0.1 });
    expect(s.position.x).toBeGreaterThan(0);
  });

  it('hits solid block', () => {
    const s = makeLlamaSpit({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    const r = tickLlamaSpit(s, { isSolid: () => true, dtSec: 0.1 });
    expect(r.hitBlock).toBe(true);
  });

  it('expires after lifetime', () => {
    const s = makeLlamaSpit({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, 1);
    const r = tickLlamaSpit(s, { isSolid: () => false, dtSec: 11 });
    expect(r.expired).toBe(true);
  });

  it('damage constant = 1', () => {
    expect(LLAMA_SPIT_DAMAGE).toBe(1);
  });
});
