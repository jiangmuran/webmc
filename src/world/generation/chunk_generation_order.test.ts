import { describe, it, expect } from 'vitest';
import { nextStage, percentDone, ORDER } from './chunk_generation_order';

describe('chunk generation order', () => {
  it('sequential', () => {
    expect(nextStage('empty')).toBe('structures_starts');
  });

  it('full is terminal', () => {
    expect(nextStage('full')).toBeUndefined();
  });

  it('start is 0%', () => {
    expect(percentDone('empty')).toBe(0);
  });

  it('full is 100%', () => {
    expect(percentDone('full')).toBe(1);
  });

  it('has expected stages', () => {
    expect(ORDER).toContain('biomes');
  });
});
