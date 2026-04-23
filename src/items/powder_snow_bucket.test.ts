import { describe, it, expect } from 'vitest';
import { pickUp, placeBlock, stackSize } from './powder_snow_bucket';

describe('powder snow bucket', () => {
  it('picks up from powder snow', () => {
    expect(pickUp({ kind: 'empty' }, 'powder_snow')?.kind).toBe('powder_snow');
  });

  it('rejects other block', () => {
    expect(pickUp({ kind: 'empty' }, 'stone')).toBeNull();
  });

  it('place empties bucket', () => {
    const r = placeBlock({ kind: 'powder_snow' });
    expect(r.placed).toBe('powder_snow');
    expect(r.bucket.kind).toBe('empty');
  });

  it('stacks to 1', () => {
    expect(stackSize()).toBe(1);
  });
});
