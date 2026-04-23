import { describe, it, expect } from 'vitest';
import { isSpiderJockey, riderEntity, riderInheritsBowEnchant } from './spider_jockey';

describe('spider jockey', () => {
  it('peaceful never', () => {
    expect(isSpiderJockey({ difficulty: 'peaceful', rng: () => 0 })).toBe(false);
  });

  it('lucky roll triggers', () => {
    expect(isSpiderJockey({ difficulty: 'normal', rng: () => 0 })).toBe(true);
  });

  it('unlucky skips', () => {
    expect(isSpiderJockey({ difficulty: 'normal', rng: () => 0.99 })).toBe(false);
  });

  it('skeleton rider', () => {
    expect(riderEntity()).toBe('skeleton');
  });

  it('rider bow enchanted', () => {
    expect(riderInheritsBowEnchant()).toBe(true);
  });
});
