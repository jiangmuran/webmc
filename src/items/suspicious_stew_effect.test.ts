import { describe, it, expect } from 'vitest';
import { effectFromSource } from './suspicious_stew_effect';

describe('suspicious stew effect', () => {
  it('dandelion gives saturation', () => {
    expect(effectFromSource('dandelion').id).toBe('saturation');
  });

  it('wither rose gives wither', () => {
    expect(effectFromSource('wither_rose').id).toBe('wither');
  });

  it('all effects have positive duration', () => {
    expect(effectFromSource('poppy').durationTicks).toBeGreaterThan(0);
  });
});
