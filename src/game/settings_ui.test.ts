import { describe, it, expect } from 'vitest';
import { applyMobilePreset, clampSettings, defaultSettings } from './settings_ui';

describe('settings', () => {
  it('defaults valid', () => {
    const d = defaultSettings();
    expect(d.fov).toBe(70);
    expect(d.language).toBe('en_us');
  });

  it('clamps out-of-range fov', () => {
    const s = clampSettings({ ...defaultSettings(), fov: 200 });
    expect(s.fov).toBe(110);
  });

  it('clamps negative volume', () => {
    const s = clampSettings({ ...defaultSettings(), musicVolume: -0.5 });
    expect(s.musicVolume).toBe(0);
  });

  it('invalid particles falls back', () => {
    const s = clampSettings({
      ...defaultSettings(),
      particles: 'xyz' as never,
    });
    expect(s.particles).toBe('all');
  });

  it('NaN fov falls back to default', () => {
    const s = clampSettings({ ...defaultSettings(), fov: NaN });
    expect(s.fov).toBe(70);
  });

  it('view distance rounded', () => {
    const s = clampSettings({ ...defaultSettings(), viewDistance: 8.7 });
    expect(s.viewDistance).toBe(9);
  });

  it('mobile low reduces view distance', () => {
    expect(applyMobilePreset('low').viewDistance).toBe(4);
  });

  it('mobile high keeps particles', () => {
    expect(applyMobilePreset('high').particles).toBe('all');
  });
});
