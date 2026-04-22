// Settings panel state. Player-local configuration persisted to local
// storage. Ranges are clamped on load; invalid values fall back to
// defaults. Changes are dispatched as events so the engine can react
// (e.g. re-apply view distance).

export interface Settings {
  fov: number; // 30..110
  viewDistance: number; // 2..32 chunks
  mouseSensitivity: number; // 0..2
  smoothLighting: boolean;
  vsync: boolean;
  particles: 'all' | 'decreased' | 'minimal';
  musicVolume: number; // 0..1
  soundVolume: number; // 0..1
  showFps: boolean;
  language: string; // "en_us", "zh_cn", ...
  renderClouds: 'off' | 'fast' | 'fancy';
  graphicsMode: 'fast' | 'fancy' | 'fabulous';
  dynamicLights: boolean;
  autoJump: boolean;
  fullscreen: boolean;
}

export function defaultSettings(): Settings {
  return {
    fov: 70,
    viewDistance: 12,
    mouseSensitivity: 0.5,
    smoothLighting: true,
    vsync: true,
    particles: 'all',
    musicVolume: 0.5,
    soundVolume: 1,
    showFps: false,
    language: 'en_us',
    renderClouds: 'fancy',
    graphicsMode: 'fancy',
    dynamicLights: true,
    autoJump: false,
    fullscreen: false,
  };
}

export function clampSettings(s: Settings): Settings {
  const d = defaultSettings();
  return {
    fov: clamp(s.fov, 30, 110, d.fov),
    viewDistance: Math.round(clamp(s.viewDistance, 2, 32, d.viewDistance)),
    mouseSensitivity: clamp(s.mouseSensitivity, 0, 2, d.mouseSensitivity),
    smoothLighting: s.smoothLighting,
    vsync: s.vsync,
    particles: ['all', 'decreased', 'minimal'].includes(s.particles) ? s.particles : d.particles,
    musicVolume: clamp(s.musicVolume, 0, 1, d.musicVolume),
    soundVolume: clamp(s.soundVolume, 0, 1, d.soundVolume),
    showFps: s.showFps,
    language: s.language.length > 0 ? s.language : d.language,
    renderClouds: ['off', 'fast', 'fancy'].includes(s.renderClouds)
      ? s.renderClouds
      : d.renderClouds,
    graphicsMode: ['fast', 'fancy', 'fabulous'].includes(s.graphicsMode)
      ? s.graphicsMode
      : d.graphicsMode,
    dynamicLights: s.dynamicLights,
    autoJump: s.autoJump,
    fullscreen: s.fullscreen,
  };
}

function clamp(v: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(v)) return fallback;
  return Math.max(min, Math.min(max, v));
}

// Mobile presets. "Low" slashes view distance; "high" bumps to desktop.
export type MobilePreset = 'low' | 'medium' | 'high';

export function applyMobilePreset(preset: MobilePreset): Partial<Settings> {
  switch (preset) {
    case 'low':
      return {
        viewDistance: 4,
        particles: 'minimal',
        renderClouds: 'off',
        graphicsMode: 'fast',
        smoothLighting: false,
        dynamicLights: false,
      };
    case 'medium':
      return {
        viewDistance: 6,
        particles: 'decreased',
        renderClouds: 'fast',
        graphicsMode: 'fast',
      };
    case 'high':
      return {
        viewDistance: 10,
        particles: 'all',
        renderClouds: 'fancy',
        graphicsMode: 'fancy',
      };
  }
}
