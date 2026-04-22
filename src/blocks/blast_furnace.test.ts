import { describe, it, expect } from 'vitest';
import { blastFurnaceRecipeFor, isBlastFurnaceInput } from './blast_furnace';

describe('blast furnace', () => {
  it('accepts ores', () => {
    expect(isBlastFurnaceInput('webmc:iron_ore')).toBe(true);
    expect(isBlastFurnaceInput('webmc:gold_ore')).toBe(true);
  });

  it('rejects food', () => {
    expect(isBlastFurnaceInput('webmc:raw_beef')).toBe(false);
  });

  it('recipe runs 2x faster', () => {
    const r = blastFurnaceRecipeFor('webmc:iron_ore');
    expect(r?.cookSec).toBe(5);
    expect(r?.output).toBe('webmc:iron_ingot');
  });
});
