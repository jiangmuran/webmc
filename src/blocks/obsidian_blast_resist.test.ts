import { describe, it, expect } from 'vitest';
import { survivesTntBlast, blastResistance } from './obsidian_blast_resist';

describe('obsidian blast resist', () => {
  it('obsidian survives', () => {
    expect(survivesTntBlast('obsidian')).toBe(true);
  });

  it('bedrock survives', () => {
    expect(survivesTntBlast('bedrock')).toBe(true);
  });

  it('stone does not', () => {
    expect(survivesTntBlast('stone')).toBe(false);
  });

  it('bedrock has huge resistance', () => {
    expect(blastResistance('bedrock')).toBeGreaterThan(blastResistance('obsidian'));
  });

  it('unknown is 0', () => {
    expect(blastResistance('air')).toBe(0);
  });
});
