import { describe, it, expect } from 'vitest';
import {
  hardnessOf,
  isUnbreakable,
  materialOf,
  miningSpecOf,
  registerHardness,
} from './block_hardness';

describe('block hardness table', () => {
  it('stone is 1.5', () => {
    expect(hardnessOf('webmc:stone')).toBe(1.5);
  });

  it('bedrock is unbreakable', () => {
    expect(isUnbreakable('webmc:bedrock')).toBe(true);
  });

  it('obsidian is 50', () => {
    expect(hardnessOf('webmc:obsidian')).toBe(50);
    expect(materialOf('webmc:obsidian')).toBe('obsidian');
  });

  it('unknown block falls back to 1.0', () => {
    expect(hardnessOf('webmc:nonexistent')).toBe(1.0);
    expect(materialOf('webmc:nonexistent')).toBe('other');
  });

  it('miningSpecOf returns both fields', () => {
    const s = miningSpecOf('webmc:oak_log');
    expect(s.hardness).toBe(2.0);
    expect(s.material).toBe('wood');
  });

  it('register is durable', () => {
    registerHardness('webmc:test_block', { hardness: 42, material: 'stone' });
    expect(hardnessOf('webmc:test_block')).toBe(42);
  });

  it('ancient debris is tough', () => {
    expect(hardnessOf('webmc:ancient_debris')).toBe(30);
  });
});
