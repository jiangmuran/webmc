import { describe, it, expect } from 'vitest';
import { wantsToVisitFlower, wantsToReturnHome } from './bee_flower_pollinate';

describe('bee flower pollinate', () => {
  it('empty visits flower', () => {
    expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: 'dandelion' })).toBe(true);
  });

  it('full skips', () => {
    expect(wantsToVisitFlower({ hasPollen: true, nearbyFlowerBlock: 'dandelion' })).toBe(false);
  });

  it('non-flower skipped', () => {
    expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: 'stone' })).toBe(false);
  });

  it('all 11 small flowers + 4 tall flowers are valid (wiki)', () => {
    const small = [
      'dandelion',
      'poppy',
      'torchflower',
      'allium',
      'azure_bluet',
      'blue_orchid',
      'cornflower',
      'lily_of_the_valley',
      'oxeye_daisy',
      'red_tulip',
      'orange_tulip',
      'white_tulip',
      'pink_tulip',
    ];
    for (const f of small) {
      expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: f })).toBe(true);
    }
    for (const f of ['sunflower', 'rose_bush', 'lilac', 'peony', 'pitcher_plant']) {
      expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: f })).toBe(true);
    }
  });

  it('wither rose is valid nectar (wiki: bees gather but get wither effect)', () => {
    expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: 'wither_rose' })).toBe(true);
  });

  it('non-flower nectar sources per wiki (pink petals, spore blossom, etc.)', () => {
    for (const b of [
      'flowering_azalea',
      'pink_petals',
      'cherry_leaves',
      'spore_blossom',
      'chorus_flower',
      'cactus_flower',
    ]) {
      expect(wantsToVisitFlower({ hasPollen: false, nearbyFlowerBlock: b })).toBe(true);
    }
  });

  it('returns home when loaded', () => {
    expect(wantsToReturnHome({ hasPollen: true, nearbyHive: true })).toBe(true);
  });

  it('no hive no return', () => {
    expect(wantsToReturnHome({ hasPollen: true })).toBe(false);
  });
});
