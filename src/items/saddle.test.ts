import { describe, it, expect } from 'vitest';
import { applySaddle, canSaddle, saddleDropChance } from './saddle';

describe('saddle', () => {
  it('fortress has the highest drop chance', () => {
    const nf = saddleDropChance('nether_fortress_chest');
    const fish = saddleDropChance('fishing_treasure');
    expect(nf).toBeGreaterThan(fish);
  });

  it('unknown source = 0 chance', () => {
    expect(saddleDropChance('unknown' as never)).toBe(0);
  });

  it('pig is saddleable, creeper is not', () => {
    expect(canSaddle('pig')).toBe(true);
    expect(canSaddle('creeper')).toBe(false);
  });

  it('horse must be tamed first', () => {
    const r = applySaddle({ mob: 'horse', isTame: false, alreadySaddled: false });
    expect(r.saddled).toBe(false);
    expect(r.reason).toBe('not_tame');
  });

  it('tamed horse saddles fine', () => {
    const r = applySaddle({ mob: 'horse', isTame: true, alreadySaddled: false });
    expect(r.saddled).toBe(true);
  });

  it('pig saddles without taming', () => {
    const r = applySaddle({ mob: 'pig', isTame: false, alreadySaddled: false });
    expect(r.saddled).toBe(true);
  });

  it('refuses when already saddled', () => {
    const r = applySaddle({ mob: 'horse', isTame: true, alreadySaddled: true });
    expect(r.saddled).toBe(false);
    expect(r.reason).toBe('already_saddled');
  });

  it('refuses non-saddleable mobs', () => {
    const r = applySaddle({ mob: 'cow', isTame: true, alreadySaddled: false });
    expect(r.reason).toBe('not_saddleable');
  });
});
