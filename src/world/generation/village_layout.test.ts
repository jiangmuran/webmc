import { describe, it, expect } from 'vitest';
import { biomeTheme, hasWell, jobSites } from './village_layout';

describe('village layout', () => {
  it('plains theme', () => {
    expect(biomeTheme('plains')).toBe('plains');
  });

  it('unknown undefined', () => {
    expect(biomeTheme('ocean')).toBeUndefined();
  });

  it('has well detection', () => {
    expect(
      hasWell([
        { type: 'well', biomeSuffix: 'plains' },
        { type: 'house', biomeSuffix: 'plains' },
      ]),
    ).toBe(true);
  });

  it('counts job sites', () => {
    expect(
      jobSites([
        { type: 'temple', biomeSuffix: 'plains' },
        { type: 'gathering', biomeSuffix: 'plains' },
        { type: 'house', biomeSuffix: 'plains' },
      ]),
    ).toBe(2);
  });
});
