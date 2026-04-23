import { describe, it, expect } from 'vitest';
import { apply, chargesCreeper, damagedByLightning } from './pig_lightning_convert';

describe('pig lightning convert', () => {
  it('pig → zombified piglin', () => {
    expect(apply('pig').into).toBe('zombified_piglin');
  });

  it('villager → witch', () => {
    expect(apply('villager').into).toBe('witch');
  });

  it('creeper stays charged', () => {
    expect(apply('creeper').into).toBeNull();
    expect(chargesCreeper('creeper')).toBe(true);
  });

  it('unknown keeps kind', () => {
    expect(apply('cow').into).toBeNull();
  });

  it('skeleton horse not damaged', () => {
    expect(damagedByLightning('skeleton_horse')).toBe(false);
  });
});
