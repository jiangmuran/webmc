import { describe, it, expect } from 'vitest';
import { settingsByCategory, validateSliderValue, type Setting } from './settings_panel_layout';

const fov: Setting = {
  id: 'fov',
  label: 'FOV',
  category: 'video',
  type: 'slider',
  min: 30,
  max: 110,
  step: 1,
};
const master: Setting = {
  id: 'master',
  label: 'Master Volume',
  category: 'audio',
  type: 'slider',
  min: 0,
  max: 1,
  step: 0.1,
};
const db: readonly Setting[] = [fov, master];

describe('settings panel layout', () => {
  it('filters by category', () => {
    expect(settingsByCategory(db, 'video')).toHaveLength(1);
  });

  it('empty category empty list', () => {
    expect(settingsByCategory(db, 'chat')).toEqual([]);
  });

  it('slider clamps max', () => {
    expect(validateSliderValue(fov, 999)).toBe(110);
  });

  it('slider clamps min', () => {
    expect(validateSliderValue(fov, -50)).toBe(30);
  });

  it('slider snaps to step', () => {
    const v = validateSliderValue(master, 0.55);
    expect(Math.round(v * 10)).toBe(6);
  });
});
