import { describe, it, expect } from 'vitest';
import { canPot, makePot, insert, remove, appliesWitherEffect } from './flower_pot_plant';

describe('flower pot', () => {
  it('canPot list', () => {
    expect(canPot('webmc:dandelion')).toBe(true);
    expect(canPot('webmc:stone')).toBe(false);
  });

  it('insert empty', () => {
    const p = makePot();
    expect(insert(p, 'webmc:poppy')).toBe(true);
    expect(insert(p, 'webmc:allium')).toBe(false);
  });

  it('remove returns content', () => {
    const p = makePot();
    insert(p, 'webmc:cactus');
    expect(remove(p)).toBe('webmc:cactus');
    expect(p.content).toBeNull();
  });

  it('wither rose in pot inert', () => {
    expect(appliesWitherEffect()).toBe(false);
  });

  it('recent plants pottable (wiki: torchflower, pale oak, eyeblossoms)', () => {
    expect(canPot('webmc:torchflower')).toBe(true);
    expect(canPot('webmc:pale_oak_sapling')).toBe(true);
    expect(canPot('webmc:closed_eyeblossom')).toBe(true);
    expect(canPot('webmc:open_eyeblossom')).toBe(true);
  });
});
