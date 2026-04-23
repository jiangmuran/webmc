export interface Options {
  fov: number;
  renderDistance: number;
  soundMaster: number;
  soundMusic: number;
  soundAmbient: number;
  mouseSensitivity: number;
  invertMouse: boolean;
  vsync: boolean;
  guiScale: 'auto' | 1 | 2 | 3 | 4;
}

export const DEFAULTS: Options = {
  fov: 70,
  renderDistance: 12,
  soundMaster: 1,
  soundMusic: 0.6,
  soundAmbient: 1,
  mouseSensitivity: 0.5,
  invertMouse: false,
  vsync: true,
  guiScale: 'auto',
};

export function sanitize(o: Partial<Options>): Options {
  return {
    ...DEFAULTS,
    ...o,
    fov: Math.max(30, Math.min(110, o.fov ?? DEFAULTS.fov)),
    renderDistance: Math.max(2, Math.min(32, o.renderDistance ?? DEFAULTS.renderDistance)),
  };
}

export function isMinimal(o: Options): boolean {
  return o.renderDistance <= 4;
}
