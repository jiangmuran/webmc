import { describe, it, expect } from 'vitest';
import { apply } from './potion_transform';

describe('potion transform', () => {
  it('water + nether wart → awkward', () => {
    expect(apply({ input: 'water', ingredient: 'nether_wart' })).toBe('awkward');
  });

  it('awkward + sugar → swiftness', () => {
    expect(apply({ input: 'awkward', ingredient: 'sugar' })).toBe('swiftness');
  });

  it('swiftness + fsEye → slowness', () => {
    expect(apply({ input: 'swiftness', ingredient: 'fermented_spider_eye' })).toBe('slowness');
  });

  it('healing + fsEye → harming', () => {
    expect(apply({ input: 'healing', ingredient: 'fermented_spider_eye' })).toBe('harming');
  });

  it('unknown returns null', () => {
    expect(apply({ input: 'water', ingredient: 'apple' })).toBeNull();
  });

  it('turtle master from turtle shell', () => {
    expect(apply({ input: 'awkward', ingredient: 'turtle_shell' })).toBe('turtle_master');
  });
});
