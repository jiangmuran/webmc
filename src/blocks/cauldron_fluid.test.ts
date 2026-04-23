import { describe, it, expect } from 'vitest';
import { rainFills, addWithBucket, drawWithBottle, washWool } from './cauldron_fluid';

describe('cauldron fluid', () => {
  it('rain fills empty', () => {
    expect(rainFills({ content: 'empty', level: 0 }, true).level).toBe(1);
  });

  it('rain doesnt fill lava', () => {
    expect(rainFills({ content: 'lava', level: 3 }, true).level).toBe(3);
  });

  it('bucket lava empty only', () => {
    expect(addWithBucket({ content: 'empty', level: 0 }, 'lava')?.level).toBe(3);
    expect(addWithBucket({ content: 'water', level: 3 }, 'lava')).toBeNull();
  });

  it('bottle draws water', () => {
    const r = drawWithBottle({ content: 'water', level: 3 });
    expect(r.bottle).toBe('water_bottle');
    expect(r.cauldron.level).toBe(2);
  });

  it('last bottle empties', () => {
    expect(drawWithBottle({ content: 'water', level: 1 }).cauldron.content).toBe('empty');
  });

  it('wool washed at water', () => {
    expect(washWool({ content: 'water', level: 2 }, 'red').clean).toBe(true);
  });

  it('wool not washed in lava', () => {
    expect(washWool({ content: 'lava', level: 3 }, 'red').clean).toBe(false);
  });
});
