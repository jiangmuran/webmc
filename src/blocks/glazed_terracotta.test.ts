import { describe, it, expect } from 'vitest';
import {
  canPistonPush,
  GLAZED_BLAST_RESISTANCE,
  GLAZED_COLORS,
  GLAZED_HARDNESS,
  GLAZED_RESISTS_PISTON,
  glazedBlockId,
  parseGlazedId,
  smeltInput,
} from './glazed_terracotta';

describe('glazed terracotta', () => {
  it('16 colors', () => {
    expect(GLAZED_COLORS.length).toBe(16);
  });

  it('block id format', () => {
    expect(glazedBlockId('red')).toBe('webmc:red_glazed_terracotta');
  });

  it('parse round trips', () => {
    expect(parseGlazedId('webmc:red_glazed_terracotta')).toBe('red');
    expect(parseGlazedId('webmc:stone')).toBeNull();
  });

  it('smelt input = colored terracotta', () => {
    expect(smeltInput('red')).toBe('webmc:red_terracotta');
  });

  it('piston cannot push', () => {
    expect(canPistonPush('webmc:red_glazed_terracotta')).toBe(false);
    expect(canPistonPush('webmc:stone')).toBe(true);
    expect(GLAZED_RESISTS_PISTON).toBe(true);
  });

  it('hardness + resistance', () => {
    expect(GLAZED_HARDNESS).toBe(1.4);
    expect(GLAZED_BLAST_RESISTANCE).toBe(1.4);
  });
});
