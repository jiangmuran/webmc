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
    expect(['playful', 'lazy', 'brown', 'weak']).toContain(child.mainGene);
  });

  it('mutation chance is 1/32 per gene (wiki), not 1/100', () => {
    // With rand = 0.04, no mutate (0.04 > 1/32 = 0.03125).
    // With rand = 0.02, mutate (0.02 < 0.03125).
    const a: Panda = { mainGene: 'aggressive', hiddenGene: 'aggressive' };
    const b: Panda = { mainGene: 'aggressive', hiddenGene: 'aggressive' };
    // Sequence: rand returns 0 for inherit toggle, 0.02 for mutate roll, 0.5 for mutated-gene pick (→ weak per table)
    const seq = [0, 0.02, 0.5, 0, 0.02, 0.5];
    let i = 0;
    const rand = (): number => seq[i++ % seq.length] ?? 0;
    const child = breedChild({ parentA: a, parentB: b, rand });
    // Mutated gene: rand=0.5 → 0.5 × 16 = 8.
    // Cumulative weights (Normal 5, Aggressive 6, Lazy 7, Worried 8, Playful 9, Weak 14, Brown 16).
    // r=8 lands at end of Worried bucket — Worried wins (since Worried cumulative = 8, condition r<acc fails for Worried at acc=8 because 8<8 is false, so Playful claims it).
    expect(['playful', 'weak', 'brown', 'normal', 'aggressive', 'lazy', 'worried']).toContain(
      child.mainGene,
    );
    // Confirm mutation triggered: result is NOT the parent's 'aggressive'.
    // Since both parents are pure aggressive, only mutation can yield non-aggressive.
    expect(child.mainGene).not.toBe('aggressive');
  });
});
