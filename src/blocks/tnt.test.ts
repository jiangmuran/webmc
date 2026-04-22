import { describe, it, expect } from 'vitest';
import { TNT_EXPLOSION_POWER, igniteTnt, makeTnt, tickTnt } from './tnt';

describe('tnt', () => {
  it('ignites exactly once', () => {
    const t = makeTnt();
    expect(igniteTnt(t)).toBe(true);
    expect(igniteTnt(t)).toBe(false);
  });

  it('explodes after 4 second fuse', () => {
    const t = makeTnt();
    igniteTnt(t);
    let exploded = false;
    for (let i = 0; i < 100; i++) {
      if (tickTnt(t, 0.1).shouldExplode) exploded = true;
    }
    expect(exploded).toBe(true);
  });

  it('un-ignited TNT never explodes', () => {
    const t = makeTnt();
    expect(tickTnt(t, 10).shouldExplode).toBe(false);
  });

  it('power is 4', () => {
    expect(TNT_EXPLOSION_POWER).toBe(4);
  });
});
