import { describe, it, expect } from 'vitest';
import { colorOf } from './dye_brewing_potion_color';

describe('potion color', () => {
  it('strength is red-ish', () => {
    const [r, , b] = colorOf('strength');
    expect(r).toBeGreaterThan(b);
  });

  it('poison is green-ish', () => {
    const [r, g] = colorOf('poison');
    expect(g).toBeGreaterThan(r);
  });

  it('leaping bright green', () => {
    expect(colorOf('leaping')[1]).toBeGreaterThan(200);
  });
});
