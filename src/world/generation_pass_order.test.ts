import { describe, it, expect } from 'vitest';
import { STAGES, nextStage, canAdvance, neighborRadius } from './generation_pass_order';

describe('generation order', () => {
  it('stage progression', () => {
    expect(nextStage('empty')).toBe('structure_starts');
    expect(nextStage('full')).toBeNull();
  });

  it('neighbor-0 stages advance freely', () => {
    expect(canAdvance({ self: 'biomes', neighborStages: [] })).toBe(true);
  });

  it('features needs neighbors', () => {
    expect(canAdvance({ self: 'liquid_carvers', neighborStages: ['empty'] })).toBe(false);
    expect(canAdvance({ self: 'liquid_carvers', neighborStages: ['liquid_carvers'] })).toBe(true);
  });

  it('cannot advance from full', () => {
    expect(canAdvance({ self: 'full', neighborStages: [] })).toBe(false);
  });

  it('radius lookup', () => {
    expect(neighborRadius('features')).toBeGreaterThan(0);
  });

  it('stages in order contain all', () => {
    expect(STAGES[0]).toBe('empty');
    expect(STAGES[STAGES.length - 1]).toBe('full');
  });
});
