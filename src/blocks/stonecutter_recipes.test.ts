import { describe, it, expect } from 'vitest';
import { outputsFor, craft } from './stonecutter_recipes';

describe('stonecutter', () => {
  it('stone has variants', () => {
    const v = outputsFor('webmc:stone');
    expect(v.find((r) => r.output === 'webmc:stone_bricks')).toBeTruthy();
  });

  it('unknown input empty', () => {
    expect(outputsFor('webmc:dirt')).toEqual([]);
  });

  it('craft multiplies slab count', () => {
    const v = outputsFor('webmc:stone');
    const idx = v.findIndex((r) => r.outputCount === 2);
    const r = craft({ input: 'webmc:stone', index: idx, count: 4 });
    expect(r?.count).toBe(8);
  });

  it('zero count null', () => {
    expect(craft({ input: 'webmc:stone', index: 0, count: 0 })).toBeNull();
  });

  it('bad index null', () => {
    expect(craft({ input: 'webmc:stone', index: 99, count: 1 })).toBeNull();
  });
});
