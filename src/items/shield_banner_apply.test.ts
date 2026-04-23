import { describe, it, expect } from 'vitest';
import { combinedShield, consumesBanner } from './shield_banner_apply';

describe('shield banner apply', () => {
  it('empty shield copies banner', () => {
    const r = combinedShield({
      shieldLayers: [],
      bannerLayers: [{ pattern: 'cross', color: 'red' }],
    });
    expect(r).toHaveLength(1);
  });

  it('decorated shield refuses combine', () => {
    expect(
      combinedShield({
        shieldLayers: [{ pattern: 'base', color: 'white' }],
        bannerLayers: [{ pattern: 'cross', color: 'red' }],
      }),
    ).toBeUndefined();
  });

  it('banner consumed', () => {
    expect(consumesBanner()).toBe(true);
  });
});
