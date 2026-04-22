import { describe, it, expect } from 'vitest';
import {
  makeProfile,
  setVariant,
  setTexture,
  setCape,
  armWidthPx,
  DEFAULT_SKINS,
} from './skin_variant';

describe('skin profile', () => {
  it('default classic', () => {
    const p = makeProfile('Steve');
    expect(p.variant).toBe('classic');
    expect(p.textureUrl).toBeNull();
  });

  it('change variant', () => {
    const p = makeProfile('Alex');
    setVariant(p, 'slim');
    expect(p.variant).toBe('slim');
  });

  it('set texture + cape', () => {
    const p = makeProfile('Steve');
    setTexture(p, 'url');
    setCape(p, 'cape');
    expect(p.textureUrl).toBe('url');
    expect(p.capeUrl).toBe('cape');
  });

  it('arm width', () => {
    expect(armWidthPx('slim')).toBeLessThan(armWidthPx('classic'));
  });

  it('defaults', () => {
    expect(DEFAULT_SKINS.classic).toContain('steve');
    expect(DEFAULT_SKINS.slim).toContain('alex');
  });
});
