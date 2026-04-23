import { describe, it, expect } from 'vitest';
import {
  professionForBlock,
  workstationForProfession,
  canChangeProfession,
} from './villager_profession_workstation';

describe('villager profession workstation', () => {
  it('lectern → librarian', () => {
    expect(professionForBlock('lectern')).toBe('librarian');
  });

  it('stone block nothing', () => {
    expect(professionForBlock('stone')).toBe('none');
  });

  it('farmer has composter', () => {
    expect(workstationForProfession('farmer')).toBe('composter');
  });

  it('can take new profession when unemployed', () => {
    expect(canChangeProfession('none', false)).toBe(true);
  });

  it('cannot change once traded', () => {
    expect(canChangeProfession('librarian', true)).toBe(false);
  });

  it('untraded villager can switch', () => {
    expect(canChangeProfession('librarian', false)).toBe(true);
  });
});
