import { describe, it, expect } from 'vitest';
import {
  intensityAfterBlock,
  isDestroyedBy,
  registerResistance,
  resistanceOf,
} from './block_resistance';

describe('block resistance', () => {
  it('dirt is easily destroyed', () => {
    expect(isDestroyedBy('webmc:dirt', 1.0)).toBe(true);
  });

  it('obsidian resists weak explosions', () => {
    expect(isDestroyedBy('webmc:obsidian', 50)).toBe(false);
  });

  it('bedrock is never destroyed', () => {
    expect(isDestroyedBy('webmc:bedrock', 10_000_000)).toBe(false);
  });

  it('unknown block falls back to 1.0', () => {
    expect(resistanceOf('webmc:weird')).toBe(1.0);
  });

  it('intensity attenuates as ray passes blocks', () => {
    const after = intensityAfterBlock('webmc:stone', 4);
    expect(after).toBeLessThan(4);
  });

  it('register is durable', () => {
    registerResistance('webmc:my_brick', 99);
    expect(resistanceOf('webmc:my_brick')).toBe(99);
  });
});
