import { describe, it, expect } from 'vitest';
import { makeStructureBlock, sampleTemplate } from './structure_block';

describe('structure block', () => {
  it('defaults to save mode', () => {
    expect(makeStructureBlock().mode).toBe('save');
  });

  it('full integrity returns the template unchanged', () => {
    const tpl = {
      blocks: [
        { pos: { x: 0, y: 0, z: 0 }, name: 'a' },
        { pos: { x: 1, y: 0, z: 0 }, name: 'b' },
      ],
    };
    expect(sampleTemplate(tpl, 1).blocks.length).toBe(2);
  });

  it('integrity 0 empties the template', () => {
    const tpl = {
      blocks: Array.from({ length: 50 }, (_, i) => ({
        pos: { x: i, y: 0, z: 0 },
        name: 'a',
      })),
    };
    const out = sampleTemplate(tpl, 0, () => 0.5);
    expect(out.blocks.length).toBe(0);
  });

  it('integrity 0.5 keeps roughly half', () => {
    const tpl = {
      blocks: Array.from({ length: 1000 }, (_, i) => ({
        pos: { x: i, y: 0, z: 0 },
        name: 'a',
      })),
    };
    const out = sampleTemplate(tpl, 0.5, Math.random);
    expect(out.blocks.length).toBeGreaterThan(400);
    expect(out.blocks.length).toBeLessThan(600);
  });
});
