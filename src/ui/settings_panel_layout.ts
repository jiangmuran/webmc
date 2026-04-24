export type SettingCategory =
  | 'video'
  | 'audio'
  | 'controls'
  | 'chat'
  | 'language'
  | 'accessibility';

export interface Setting {
  id: string;
  label: string;
  category: SettingCategory;
  type: 'slider' | 'toggle' | 'select' | 'keybind';
  min?: number;
  max?: number;
  step?: number;
  options?: readonly string[];
}

export function settingsByCategory(
  all: readonly Setting[],
  category: SettingCategory,
): readonly Setting[] {
  return all.filter((s) => s.category === category);
}

export function validateSliderValue(s: Setting, value: number): number {
  if (s.type !== 'slider') return value;
  const min = s.min ?? 0;
  const max = s.max ?? 1;
  const step = s.step ?? 1;
  const clamped = Math.max(min, Math.min(max, value));
  const snapped = Math.round((clamped - min) / step) * step + min;
  return Math.max(min, Math.min(max, snapped));
}
