import { describe, it, expect } from 'vitest';
import {
  claimsAsPoi,
  profession,
  useGivesRecipe,
  FLETCHER_WORK_SOUND,
} from './fletching_table_use';

describe('fletching table use', () => {
  it('is a POI', () => {
    expect(claimsAsPoi()).toBe(true);
  });

  it('profession fletcher', () => {
    expect(profession()).toBe('fletcher');
  });

  it('no recipe GUI', () => {
    expect(useGivesRecipe()).toBe(false);
  });

  it('emits sound id', () => {
    expect(FLETCHER_WORK_SOUND).toContain('fletching_table');
  });
});
