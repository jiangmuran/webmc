import { describe, it, expect } from 'vitest';
import {
  clearHostilityAfter,
  isGoldArmor,
  makePiglinGoldState,
  onChestOpenedNearPiglin,
  piglinShouldAggro,
  wearingGoldArmor,
} from './piglin_gold';

describe('piglin gold', () => {
  it('identifies gold armor pieces', () => {
    expect(isGoldArmor('webmc:gold_helmet')).toBe(true);
    expect(isGoldArmor('webmc:iron_helmet')).toBe(false);
  });

  it('wearing any gold armor calms piglins', () => {
    const s = makePiglinGoldState();
    expect(piglinShouldAggro(s, ['webmc:gold_helmet'])).toBe(false);
    expect(piglinShouldAggro(s, ['webmc:iron_helmet'])).toBe(true);
  });

  it('chest opening overrides neutrality', () => {
    const s = makePiglinGoldState();
    onChestOpenedNearPiglin(s);
    expect(piglinShouldAggro(s, ['webmc:gold_helmet'])).toBe(true);
  });

  it('clearing hostility returns to neutral', () => {
    const s = makePiglinGoldState();
    onChestOpenedNearPiglin(s);
    clearHostilityAfter(s, 30);
    expect(piglinShouldAggro(s, ['webmc:gold_helmet'])).toBe(false);
  });

  it('wearingGoldArmor needs one gold piece', () => {
    expect(wearingGoldArmor([])).toBe(false);
    expect(wearingGoldArmor(['webmc:leather_helmet', 'webmc:gold_boots'])).toBe(true);
  });
});
