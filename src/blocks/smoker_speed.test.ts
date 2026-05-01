import { describe, it, expect } from 'vitest';
import {
  canAccept,
  FURNACE_SMELT_SEC,
  smeltDuration,
  smeltOutput,
  FAST_SMELT_SEC,
} from './smoker_speed';

describe('smoker / blast furnace', () => {
  it('smoker is 2× as fast', () => {
    expect(smeltDuration('smoker')).toBe(FAST_SMELT_SEC);
    expect(smeltDuration('furnace')).toBe(FURNACE_SMELT_SEC);
    expect(FAST_SMELT_SEC * 2).toBe(FURNACE_SMELT_SEC);
  });

  it('smoker accepts food only', () => {
    expect(canAccept('smoker', 'webmc:raw_beef')).toBe(true);
    expect(canAccept('smoker', 'webmc:iron_ore')).toBe(false);
  });

  it('blast furnace accepts metals only', () => {
    expect(canAccept('blast_furnace', 'webmc:iron_ore')).toBe(true);
    expect(canAccept('blast_furnace', 'webmc:raw_beef')).toBe(false);
  });

  it('furnace accepts everything', () => {
    expect(canAccept('furnace', 'webmc:anything')).toBe(true);
  });

  it('smelt outputs map known inputs', () => {
    expect(smeltOutput('webmc:iron_ore')).toBe('webmc:iron_ingot');
    expect(smeltOutput('webmc:raw_beef')).toBe('webmc:cooked_beef');
  });

  it('unknown input = null', () => {
    expect(smeltOutput('webmc:xyz')).toBeNull();
  });

  it('mutton + rabbit cook (wiki: full meat coverage)', () => {
    // Wiki (minecraft.wiki/w/Smelting#Inputs): raw_mutton →
    // cooked_mutton, raw_rabbit → cooked_rabbit. Old SMELT_OUTPUTS
    // omitted both, so a smoker loaded with raw lamb/rabbit
    // returned no cooked output.
    expect(smeltOutput('webmc:raw_mutton')).toBe('webmc:cooked_mutton');
    expect(smeltOutput('webmc:raw_rabbit')).toBe('webmc:cooked_rabbit');
  });

  it('nether gold ore smelts to gold ingot (wiki)', () => {
    expect(smeltOutput('webmc:nether_gold_ore')).toBe('webmc:gold_ingot');
  });
});
