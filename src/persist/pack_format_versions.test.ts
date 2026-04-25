import { describe, it, expect } from 'vitest';
import {
  resourcePackVersion,
  dataPackVersion,
  KNOWN_RESOURCE_PACK_FORMATS,
  KNOWN_DATA_PACK_FORMATS,
} from './pack_format_versions';

describe('pack_format → version mapping', () => {
  it('resolves known resource pack formats', () => {
    expect(resourcePackVersion(15)).toContain('1.20');
    expect(resourcePackVersion(46)).toContain('1.21.5');
    expect(resourcePackVersion(64)).toContain('1.21.8');
  });

  it('resolves known data pack formats', () => {
    expect(dataPackVersion(15)).toContain('1.20');
    expect(dataPackVersion(48)).toContain('1.21');
    expect(dataPackVersion(80)).toContain('1.21.6');
  });

  it('returns "unknown" for unmapped formats', () => {
    expect(resourcePackVersion(9999)).toContain('unknown');
    expect(dataPackVersion(-1)).toContain('unknown');
  });

  it('exposes sorted lists of known formats', () => {
    expect(KNOWN_RESOURCE_PACK_FORMATS.length).toBeGreaterThan(10);
    expect(KNOWN_DATA_PACK_FORMATS.length).toBeGreaterThan(10);
    for (let i = 1; i < KNOWN_RESOURCE_PACK_FORMATS.length; i++) {
      expect(KNOWN_RESOURCE_PACK_FORMATS[i]).toBeGreaterThan(
        KNOWN_RESOURCE_PACK_FORMATS[i - 1] ?? -1,
      );
    }
  });
});
