import { describe, it, expect } from 'vitest';
import { accepts, advanceCrop, advanceSapling } from './bonemeal_target';

describe('bonemeal target', () => {
  it('none rejected', () => {
    expect(accepts({ kind: 'none' })).toBe(false);
  });

  it('crop accepted', () => {
    expect(accepts({ kind: 'crop', cropId: 'wheat', age: 0, maxAge: 7 })).toBe(true);
  });

  it('advanceCrop increments', () => {
    const r = advanceCrop({ kind: 'crop', cropId: 'wheat', age: 0, maxAge: 7 }, () => 0);
    expect(r.kind).toBe('crop');
    if (r.kind === 'crop') expect(r.age).toBeGreaterThan(0);
  });

  it('advanceCrop caps at max', () => {
    const r = advanceCrop({ kind: 'crop', cropId: 'wheat', age: 7, maxAge: 7 }, () => 1);
    if (r.kind === 'crop') expect(r.age).toBe(7);
  });

  it('advanceSapling clamps', () => {
    const r = advanceSapling({ kind: 'sapling', treeType: 'oak', stage: 0 });
    if (r.kind === 'sapling') expect(r.stage).toBe(1);
  });
});
