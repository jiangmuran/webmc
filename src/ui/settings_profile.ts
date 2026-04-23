// Persisted settings profile. Groups user preferences; migrates on load.

export interface Settings {
  version: number;
  fov: number;
  renderDistanceChunks: number;
  masterVolume: number;
  sensitivity: number;
  invertY: boolean;
  hudScale: number;
  language: string;
  subtitles: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export const CURRENT_VERSION = 3;

export function defaultSettings(): Settings {
  return {
    version: CURRENT_VERSION,
    fov: 75,
    renderDistanceChunks: 8,
    masterVolume: 1,
    sensitivity: 0.5,
    invertY: false,
    hudScale: 1,
    language: 'en-US',
    subtitles: false,
    colorBlindMode: 'none',
  };
}

export function migrate(raw: Partial<Settings>): Settings {
  const base = defaultSettings();
  const s: Settings = { ...base, ...raw, version: CURRENT_VERSION };
  s.fov = Math.max(30, Math.min(110, s.fov));
  s.renderDistanceChunks = Math.max(2, Math.min(32, s.renderDistanceChunks));
  s.masterVolume = Math.max(0, Math.min(1, s.masterVolume));
  s.sensitivity = Math.max(0.01, Math.min(2, s.sensitivity));
  s.hudScale = Math.max(0.5, Math.min(3, s.hudScale));
  return s;
}
