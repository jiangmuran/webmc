import { describe, it, expect } from 'vitest';
import { isChainable, buildChain, type Block } from './piston_slime_honey_chain';

const slime: Block = { id: 'slime_block', sticky: true };
const honey: Block = { id: 'honey_block', sticky: true };
const stone: Block = { id: 'stone', sticky: false };

describe('slime/honey piston chain', () => {
  it('slime-slime chain', () => {
    expect(isChainable(slime, slime)).toBe(true);
  });

  it('slime-honey breaks', () => {
    expect(isChainable(slime, honey)).toBe(false);
    expect(isChainable(honey, slime)).toBe(false);
  });

  it('stone-stone no chain', () => {
    expect(isChainable(stone, stone)).toBe(false);
  });

  it('slime pulls stone', () => {
    expect(isChainable(slime, stone)).toBe(true);
  });

  it('buildChain terminates on honey-slime', () => {
    const world: Record<string, Block> = {
      a: slime,
      b: slime,
      c: honey,
    };
    const order = ['a', 'b', 'c', 'd'];
    const step = (s: string) => order[order.indexOf(s) + 1] ?? 'air';
    const chain = buildChain(
      'a',
      (id) => world[id],
      (id) => world[id]?.id ?? 'air',
      step,
    );
    expect(chain).toEqual(['a', 'b']);
  });
});
