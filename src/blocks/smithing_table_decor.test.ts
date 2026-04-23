import { describe, it, expect } from 'vitest';
import { villagerProfession, claimsAsPoi, recipeGUI, emitsWorkSound } from './smithing_table_decor';

describe('smithing table decor', () => {
  it('profession toolsmith', () => {
    expect(villagerProfession()).toBe('toolsmith');
  });

  it('POI', () => {
    expect(claimsAsPoi()).toBe(true);
  });

  it('smithing GUI', () => {
    expect(recipeGUI()).toBe('smithing');
  });

  it('emits work sound', () => {
    expect(emitsWorkSound()).toContain('smithing_table');
  });
});
