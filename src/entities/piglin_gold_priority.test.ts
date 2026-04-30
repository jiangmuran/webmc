import { describe, it, expect } from 'vitest';
import {
  isGoldItem,
  isGoldArmor,
  piglinPassiveIfWearing,
  barterable,
} from './piglin_gold_priority';

describe('piglin gold priority', () => {
  it('gold ingot recognized', () => {
    expect(isGoldItem('gold_ingot')).toBe(true);
  });

  it('iron not gold', () => {
    expect(isGoldItem('iron_ingot')).toBe(false);
  });

  it('gold boots armor', () => {
    expect(isGoldArmor('golden_boots')).toBe(true);
  });

  it('ingot not armor', () => {
    expect(isGoldArmor('gold_ingot')).toBe(false);
  });

  it('wearing any gold → passive', () => {
    expect(piglinPassiveIfWearing(['iron_helmet', 'golden_boots'])).toBe(true);
  });

  it('no gold → hostile', () => {
    expect(piglinPassiveIfWearing(['iron_helmet'])).toBe(false);
  });

  it('ingot barters', () => {
    expect(barterable('gold_ingot')).toBe(true);
  });

  it('block not barterable', () => {
    expect(barterable('gold_block')).toBe(false);
  });

  it('powered_rail is NOT piglin-loved (wiki: not in piglin_loved tag)', () => {
    expect(isGoldItem('powered_rail')).toBe(false);
  });

  it('1.21+ piglin-loved additions (wiki)', () => {
    expect(isGoldItem('golden_dandelion')).toBe(true);
    expect(isGoldItem('golden_spear')).toBe(true);
    expect(isGoldItem('golden_nautilus_armor')).toBe(true);
  });
});
