import { describe, it, expect } from 'vitest';
import { visiblePersonality, isDominant, breedChild, type Panda } from './panda_personality_breed';

describe('panda', () => {
  it('dominance', () => {
    expect(isDominant('normal')).toBe(true);
    expect(isDominant('brown')).toBe(false);
  });

  it('dominant main shows through', () => {
    expect(visiblePersonality({ mainGene: 'playful', hiddenGene: 'weak' })).toBe('playful');
  });

  it('matching recessive shows', () => {
    expect(visiblePersonality({ mainGene: 'brown', hiddenGene: 'brown' })).toBe('brown');
  });

  it('mismatched recessive = normal', () => {
    expect(visiblePersonality({ mainGene: 'brown', hiddenGene: 'lazy' })).toBe('normal');
  });

  it('breed inherits genes', () => {
    const a: Panda = { mainGene: 'playful', hiddenGene: 'brown' };
    const b: Panda = { mainGene: 'lazy', hiddenGene: 'weak' };
    const child = breedChild({ parentA: a, parentB: b, rand: () => 0.1 });
    expect(['playful', 'lazy', 'brown', 'weak', 'brown']).toContain(child.mainGene);
  });
});
