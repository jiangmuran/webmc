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
});
