import { describe, it, expect } from 'vitest';
import { defaultSettings, migrate, CURRENT_VERSION } from './settings_profile';

describe('settings profile', () => {
  it('defaults sensible', () => {
    const s = defaultSettings();
    expect(s.version).toBe(CURRENT_VERSION);
    expect(s.fov).toBe(75);
  });

  it('migrate clamps fov', () => {
    const s = migrate({ fov: 999 });
    expect(s.fov).toBe(110);
  });

  it('migrate clamps volume', () => {
    expect(migrate({ masterVolume: 5 }).masterVolume).toBe(1);
    expect(migrate({ masterVolume: -1 }).masterVolume).toBe(0);
  });

  it('migrate sets version', () => {
    expect(migrate({ version: 1 }).version).toBe(CURRENT_VERSION);
  });

  it('migrate preserves language', () => {
    expect(migrate({ language: 'zh-CN' }).language).toBe('zh-CN');
  });

  it('render distance clamped', () => {
    expect(migrate({ renderDistanceChunks: 100 }).renderDistanceChunks).toBe(32);
  });
});
