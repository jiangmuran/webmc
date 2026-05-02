import { describe, it, expect } from 'vitest';
import { breedPanda, visiblePersonality, wildPandaGenotype } from './panda_genetics';

describe('panda genetics', () => {
  it('matching pair = that gene', () => {
    expect(visiblePersonality('aggressive', 'aggressive')).toBe('aggressive');
    expect(visiblePersonality('brown', 'brown')).toBe('brown');
  });

  it('dominant over recessive', () => {
    expect(visiblePersonality('aggressive', 'normal')).toBe('aggressive');
  });

  it('heterozygous recessive falls back to normal (wiki)', () => {
    expect(visiblePersonality('brown', 'aggressive')).toBe('normal');
    expect(visiblePersonality('weak', 'lazy')).toBe('normal');
  });

  it('breed inherits one gene from each', () => {
    let calls = 0;
    const seq = [0.3, 0.7];
    const rng = (): number => seq[calls++ % seq.length] ?? 0;
    const child = breedPanda({
      parentA: { dominant: 'aggressive', recessive: 'normal' },
      parentB: { dominant: 'lazy', recessive: 'brown' },
      rng,
    });
    expect(['aggressive', 'normal']).toContain(child.dominant);
    expect(['lazy', 'brown']).toContain(child.recessive);
  });

  it('wild genotype has both genes', () => {
    const g = wildPandaGenotype(() => 0.5);
    expect(g.dominant).toBeDefined();
    expect(g.recessive).toBeDefined();
  });
});
