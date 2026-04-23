import { describe, it, expect } from 'vitest';
import { canSleep, breakingHeadRemovesFoot, occupiedFlagShared } from './bed_head_foot';

describe('bed head foot', () => {
  it('complete bed allows sleep', () => {
    expect(canSleep({ thisPart: 'head', adjacentPart: 'foot' })).toBe(true);
  });

  it('lone head cannot sleep', () => {
    expect(canSleep({ thisPart: 'head' })).toBe(false);
  });

  it('same part invalid', () => {
    expect(canSleep({ thisPart: 'head', adjacentPart: 'head' })).toBe(false);
  });

  it('break propagates', () => {
    expect(breakingHeadRemovesFoot('head')).toBe(true);
  });

  it('shared occupied', () => {
    expect(occupiedFlagShared()).toBe(true);
  });
});
