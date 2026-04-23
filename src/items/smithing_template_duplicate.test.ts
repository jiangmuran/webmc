import { describe, it, expect } from 'vitest';
import { canDuplicate, outputCount, DIAMOND_COST } from './smithing_template_duplicate';

describe('smithing template duplicate', () => {
  it('valid copy', () => {
    expect(
      canDuplicate({ templateId: 'dune', matchingBlock: 'sandstone', diamondCount: DIAMOND_COST }),
    ).toBe(true);
  });

  it('wrong block', () => {
    expect(
      canDuplicate({ templateId: 'dune', matchingBlock: 'stone', diamondCount: DIAMOND_COST }),
    ).toBe(false);
  });

  it('low diamond fail', () => {
    expect(canDuplicate({ templateId: 'dune', matchingBlock: 'sandstone', diamondCount: 1 })).toBe(
      false,
    );
  });

  it('output count 2', () => {
    expect(outputCount()).toBe(2);
  });
});
