import { describe, it, expect } from 'vitest';
import { randomTick, waxedOf, scrapeWax, scrapeAxeOxidation } from './copper_waxing';

describe('copper waxing', () => {
  it('waxed never advances', () => {
    expect(randomTick('copper', true, () => 0)).toBe('copper');
  });

  it('unwaxed advances on tiny roll', () => {
    expect(randomTick('copper', false, () => 0)).toBe('exposed_copper');
  });

  it('oxidized terminal', () => {
    expect(randomTick('oxidized_copper', false, () => 0)).toBe('oxidized_copper');
  });

  it('waxed id format', () => {
    expect(waxedOf('copper')).toBe('waxed_copper');
  });

  it('scrape wax reveals stage', () => {
    expect(scrapeWax('waxed_weathered_copper')).toBe('weathered_copper');
    expect(scrapeWax('copper')).toBeNull();
  });

  it('axe reverts oxidation', () => {
    expect(scrapeAxeOxidation('oxidized_copper')).toBe('weathered_copper');
    expect(scrapeAxeOxidation('copper')).toBe('copper');
  });
});
