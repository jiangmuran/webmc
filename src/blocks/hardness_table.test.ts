import { describe, it, expect } from 'vitest';
import { hardnessOf, unbreakable, instantMine } from './hardness_table';

describe('hardness table', () => {
  it('bedrock unbreakable', () => {
    expect(unbreakable('bedrock')).toBe(true);
  });

  it('air instant', () => {
    expect(instantMine('air')).toBe(true);
  });

  it('stone 1.5', () => {
    expect(hardnessOf('stone')).toBe(1.5);
  });

  it('unknown default 1', () => {
    expect(hardnessOf('mystery')).toBe(1);
  });
});
