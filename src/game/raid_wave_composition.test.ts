import { describe, it, expect } from 'vitest';
import { waveComposition, totalMobs } from './raid_wave_composition';

describe('raid wave composition', () => {
  it('wave 0 pillagers', () => {
    expect(waveComposition({ waveIndex: 0, isBadOmenII: false }).pillager).toBeGreaterThan(0);
  });

  it('ravager from wave 4', () => {
    expect(waveComposition({ waveIndex: 4, isBadOmenII: false }).ravager).toBe(1);
    expect(waveComposition({ waveIndex: 2, isBadOmenII: false }).ravager).toBe(0);
  });

  it('evoker from wave 3', () => {
    expect(waveComposition({ waveIndex: 3, isBadOmenII: false }).evoker).toBe(1);
  });

  it('bad omen II adds mobs', () => {
    const normal = totalMobs({ waveIndex: 2, isBadOmenII: false });
    const omen = totalMobs({ waveIndex: 2, isBadOmenII: true });
    expect(omen).toBeGreaterThan(normal);
  });

  it('later waves bigger', () => {
    expect(totalMobs({ waveIndex: 4, isBadOmenII: false })).toBeGreaterThan(
      totalMobs({ waveIndex: 0, isBadOmenII: false }),
    );
  });
});
