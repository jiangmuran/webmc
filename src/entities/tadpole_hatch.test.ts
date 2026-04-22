import { describe, it, expect } from 'vitest';
import {
  makeTadpole,
  tickTadpole,
  bucketTadpole,
  MATURE_AGE,
  MAX_OUT_OF_WATER,
} from './tadpole_hatch';

describe('tadpole', () => {
  it('ages in water', () => {
    const t = makeTadpole();
    for (let i = 0; i < MATURE_AGE - 1; i++) tickTadpole(t, { inWater: true });
    expect(tickTadpole(t, { inWater: true }).matured).toBe(true);
  });

  it('suffocates out of water', () => {
    const t = makeTadpole();
    for (let i = 0; i < MAX_OUT_OF_WATER - 1; i++) tickTadpole(t, { inWater: false });
    expect(tickTadpole(t, { inWater: false }).suffocated).toBe(true);
  });

  it('re-entering water resets timer', () => {
    const t = makeTadpole();
    tickTadpole(t, { inWater: false });
    tickTadpole(t, { inWater: true });
    expect(t.outOfWaterTicks).toBe(0);
  });

  it('bucket with empty', () => {
    const t = makeTadpole();
    expect(bucketTadpole(t, true)).toBe('bucketed');
    expect(bucketTadpole(t, false)).toBe('no_bucket');
  });
});
