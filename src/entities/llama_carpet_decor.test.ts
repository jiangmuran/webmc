import { describe, it, expect } from 'vitest';
import { decorate, undress, canDecorate, spreadsToCaravan } from './llama_carpet_decor';

describe('llama carpet decor', () => {
  it('decorate replaces', () => {
    expect(decorate('red', 'blue')).toBe('blue');
  });

  it('undress clears', () => {
    expect(undress()).toBeNull();
  });

  it('needs alive llama', () => {
    expect(canDecorate(10)).toBe(true);
    expect(canDecorate(0)).toBe(false);
  });

  it('caravan not inherited', () => {
    expect(spreadsToCaravan()).toBe(false);
  });
});
