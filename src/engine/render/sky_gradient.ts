// Sky gradient color by time of day. The sky is a 3-stop gradient from
// zenith (top) through horizon to a fog band. Colors interpolate across
// five anchor times: dawn, noon, dusk, deep night, midnight. Used by the
// renderer's skybox fragment shader.

export type RGB = readonly [number, number, number];

export interface SkyStops {
  zenith: RGB;
  horizon: RGB;
  fog: RGB;
}

// Time in ticks-in-day normalized to [0, 1). 0 = dawn, 0.25 = noon,
// 0.5 = dusk, 0.75 = midnight.
export type NormalizedTime = number;

interface Anchor {
  at: NormalizedTime;
  stops: SkyStops;
}

const ANCHORS: readonly Anchor[] = [
  {
    at: 0.0,
    stops: {
      zenith: [0x2b, 0x3a, 0x6b],
      horizon: [0xff, 0xb0, 0x7a],
      fog: [0xff, 0xd0, 0xa0],
    },
  },
  {
    at: 0.25,
    stops: {
      zenith: [0x3c, 0x8d, 0xff],
      horizon: [0xbf, 0xdf, 0xff],
      fog: [0xc8, 0xe0, 0xff],
    },
  },
  {
    at: 0.5,
    stops: {
      zenith: [0x2a, 0x34, 0x5e],
      horizon: [0xff, 0x88, 0x44],
      fog: [0xd5, 0xa8, 0x7d],
    },
  },
  {
    at: 0.75,
    stops: {
      zenith: [0x02, 0x05, 0x12],
      horizon: [0x09, 0x10, 0x28],
      fog: [0x14, 0x18, 0x2c],
    },
  },
];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ];
}

export function skyAt(time: NormalizedTime): SkyStops {
  const t = ((time % 1) + 1) % 1;
  for (let i = 0; i < ANCHORS.length; i++) {
    const cur = ANCHORS[i];
    const next = ANCHORS[(i + 1) % ANCHORS.length];
    if (!cur || !next) continue;
    const spanEnd = next.at === 0 ? 1 : next.at;
    if (t >= cur.at && t < spanEnd) {
      const local = (t - cur.at) / (spanEnd - cur.at);
      return {
        zenith: lerpRGB(cur.stops.zenith, next.stops.zenith, local),
        horizon: lerpRGB(cur.stops.horizon, next.stops.horizon, local),
        fog: lerpRGB(cur.stops.fog, next.stops.fog, local),
      };
    }
  }
  const fallback = ANCHORS[0];
  if (!fallback) throw new Error('no anchors');
  return fallback.stops;
}

// Ambient intensity 0..1 for mobs/light: peak at noon, trough at midnight.
export function ambientIntensity(time: NormalizedTime): number {
  const t = ((time % 1) + 1) % 1;
  // Cosine from midnight valley to noon peak, normalized into [0, 1].
  return 0.5 + 0.5 * Math.cos((t - 0.25) * Math.PI * 2);
}
