import { describe, it, expect } from 'vitest';
import {
  canCopy,
  outputCount,
  MATCHING_BLOCK,
  TEMPLATE_COPY_DIAMOND_COST,
  TEMPLATE_OUTPUT_COUNT,
} from './smithing_template_copy';

describe('smithing template copy', () => {
  it('needs 7 diamonds', () => {
    expect(
      canCopy({
        template: 'dune',
        diamonds: TEMPLATE_COPY_DIAMOND_COST,
        matchingBlock: 'sandstone',
      }),
    ).toBe(true);
  });

  it('insufficient diamonds fail', () => {
    expect(canCopy({ template: 'dune', diamonds: 3, matchingBlock: 'sandstone' })).toBe(false);
  });

  it('wrong matching block fail', () => {
    expect(
      canCopy({
        template: 'dune',
        diamonds: TEMPLATE_COPY_DIAMOND_COST,
        matchingBlock: 'stone',
      }),
    ).toBe(false);
  });

  it('output = 2', () => {
    expect(outputCount()).toBe(TEMPLATE_OUTPUT_COUNT);
  });

  it('netherite template known', () => {
    expect(MATCHING_BLOCK['netherite_upgrade']).toBe('netherite_ingot');
  });

  it('all 19 wiki trim templates present', () => {
    const all = [
      'netherite_upgrade',
      'sentry',
      'dune',
      'coast',
      'wild',
      'ward',
      'silence',
      'eye',
      'vex',
      'tide',
      'snout',
      'rib',
      'spire',
      'flow',
      'bolt',
      'host',
      'raiser',
      'shaper',
      'wayfinder',
    ];
    for (const t of all) {
      expect(MATCHING_BLOCK[t]).toBeDefined();
    }
  });

  it('trail ruins terracotta-themed trims duplicate with terracotta (wiki)', () => {
    expect(MATCHING_BLOCK['host']).toBe('terracotta');
    expect(MATCHING_BLOCK['raiser']).toBe('terracotta');
    expect(MATCHING_BLOCK['shaper']).toBe('terracotta');
    expect(MATCHING_BLOCK['wayfinder']).toBe('terracotta');
  });
});
