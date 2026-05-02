import { describe, it, expect } from 'vitest';
import { statsFor, canEat, postEatEffects } from './food_stats_table';

describe('food stats table', () => {
  it('apple stats', () => {
    expect(statsFor('apple')?.hunger).toBe(4);
  });

  it('unknown null', () => {
    expect(statsFor('ruby')).toBeNull();
  });

  it('cannot eat at full hunger', () => {
    expect(canEat('apple', 1)).toBe(false);
  });

  it('can always eat golden apple', () => {
    expect(canEat('golden_apple', 1)).toBe(true);
  });

  it('rotten flesh hunger effect', () => {
    const fx = postEatEffects('rotten_flesh');
    expect(fx.some((e) => e.id === 'hunger')).toBe(true);
  });

  it('spider eye poison', () => {
    expect(postEatEffects('spider_eye').some((e) => e.id === 'poison')).toBe(true);
  });

  it('apple no negative effect', () => {
    expect(postEatEffects('apple').length).toBe(0);
  });

  it('raw pufferfish gives Hunger III + Poison II + Nausea (wiki)', () => {
    // Wiki minecraft.wiki/w/Pufferfish: eating raw inflicts the
    // signature triple-debuff Hunger III + Poison II + Nausea.
    const fx = postEatEffects('pufferfish');
    expect(fx.find((e) => e.id === 'hunger')?.amplifier).toBe(2);
    expect(fx.find((e) => e.id === 'poison')?.amplifier).toBe(1);
    expect(fx.some((e) => e.id === 'nausea')).toBe(true);
  });
});
