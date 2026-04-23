import { describe, it, expect } from 'vitest';
import { blockHardness, isUnbreakable, blastResistance } from './block_hardness_table';

describe('block hardness table', () => {
  it('dirt soft', () => {
    expect(blockHardness('dirt')).toBeLessThan(1);
  });

  it('obsidian hard', () => {
    expect(blockHardness('obsidian')).toBeGreaterThan(30);
  });

  it('bedrock unbreakable', () => {
    expect(isUnbreakable('bedrock')).toBe(true);
  });

  it('stone breakable', () => {
    expect(isUnbreakable('stone')).toBe(false);
  });

  it('obsidian blast-proof', () => {
    expect(blastResistance('obsidian')).toBe(1200);
  });

  it('end portal frame immortal', () => {
    expect(blastResistance('end_portal_frame')).toBeGreaterThan(1000000);
  });

  it('unknown block zero', () => {
    expect(blockHardness('fake_block')).toBe(0);
  });
});
