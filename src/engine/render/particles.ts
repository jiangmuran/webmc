// Particle registry — declarative table of effects (color, size,
// lifetime). Pure: the renderer owns emission but queries this table for
// per-effect params. Particle system can grow without editing the renderer.

export type ParticleKind =
  | 'smoke'
  | 'flame'
  | 'lava_drip'
  | 'water_drip'
  | 'bubble'
  | 'crit'
  | 'heart'
  | 'block_break'
  | 'explosion'
  | 'portal'
  | 'enchant'
  | 'rain_splash'
  | 'snowflake'
  | 'note';

export interface ParticleDef {
  kind: ParticleKind;
  color: readonly [number, number, number]; // RGB 0..255
  sizeMeters: number;
  lifetimeSec: number;
  gravity: number;
  drag: number;
}

export const PARTICLES: Record<ParticleKind, ParticleDef> = {
  smoke: {
    kind: 'smoke',
    color: [100, 100, 100],
    sizeMeters: 0.15,
    lifetimeSec: 1.5,
    gravity: -1,
    drag: 0.95,
  },
  flame: {
    kind: 'flame',
    color: [255, 150, 60],
    sizeMeters: 0.1,
    lifetimeSec: 1.5,
    gravity: -0.8,
    drag: 0.95,
  },
  lava_drip: {
    kind: 'lava_drip',
    color: [230, 80, 20],
    sizeMeters: 0.1,
    lifetimeSec: 2,
    gravity: 4,
    drag: 0.98,
  },
  water_drip: {
    kind: 'water_drip',
    color: [80, 120, 220],
    sizeMeters: 0.08,
    lifetimeSec: 2,
    gravity: 5,
    drag: 0.98,
  },
  bubble: {
    kind: 'bubble',
    color: [200, 220, 255],
    sizeMeters: 0.06,
    lifetimeSec: 1,
    gravity: -5,
    drag: 0.9,
  },
  crit: {
    kind: 'crit',
    color: [255, 240, 180],
    sizeMeters: 0.08,
    lifetimeSec: 0.5,
    gravity: 3,
    drag: 0.95,
  },
  heart: {
    kind: 'heart',
    color: [230, 60, 90],
    sizeMeters: 0.2,
    lifetimeSec: 1.2,
    gravity: -1.5,
    drag: 0.98,
  },
  block_break: {
    kind: 'block_break',
    color: [180, 180, 180],
    sizeMeters: 0.1,
    lifetimeSec: 0.6,
    gravity: 8,
    drag: 0.9,
  },
  explosion: {
    kind: 'explosion',
    color: [255, 255, 230],
    sizeMeters: 0.6,
    lifetimeSec: 1,
    gravity: 0,
    drag: 0.9,
  },
  portal: {
    kind: 'portal',
    color: [160, 60, 240],
    sizeMeters: 0.1,
    lifetimeSec: 2,
    gravity: 0,
    drag: 0.96,
  },
  enchant: {
    kind: 'enchant',
    color: [240, 200, 120],
    sizeMeters: 0.05,
    lifetimeSec: 1.5,
    gravity: 0,
    drag: 0.98,
  },
  rain_splash: {
    kind: 'rain_splash',
    color: [180, 200, 220],
    sizeMeters: 0.1,
    lifetimeSec: 0.3,
    gravity: 0,
    drag: 0.9,
  },
  snowflake: {
    kind: 'snowflake',
    color: [250, 250, 255],
    sizeMeters: 0.1,
    lifetimeSec: 3,
    gravity: 0.5,
    drag: 0.98,
  },
  note: {
    kind: 'note',
    color: [60, 200, 140],
    sizeMeters: 0.15,
    lifetimeSec: 1,
    gravity: -1,
    drag: 0.98,
  },
};

export function particleFor(kind: ParticleKind): ParticleDef {
  return PARTICLES[kind];
}
