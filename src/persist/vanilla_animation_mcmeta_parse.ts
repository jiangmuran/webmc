// Parse a vanilla texture animation .mcmeta file. These sidecar files
// describe how a tile texture is animated. Schema:
//
//   { "animation": {
//       "frametime": <int=1>,        // ticks per frame (default for unspecified frames)
//       "interpolate": <bool=false>, // smooth between frames
//       "width": <int|null>,         // sub-frame width (default = texture width)
//       "height": <int|null>,
//       "frames": [
//         <int>,                     // frame index, default frametime
//         { "index": <int>, "time": <int> }
//       ]
//     }
//   }
//
// Source: minecraft.wiki "Resource pack — animation". Behavioral spec — clean-room.

export interface AnimationFrame {
  index: number;
  // Per-frame override; falls back to the top-level frametime when 0.
  time: number;
}

export interface ParsedAnimationMcmeta {
  frametime: number;
  interpolate: boolean;
  width: number | null;
  height: number | null;
  frames: AnimationFrame[];
}

export class AnimationMcmetaParseError extends Error {}

function readFrame(v: unknown): AnimationFrame {
  if (typeof v === 'number') return { index: Math.trunc(v), time: 0 };
  if (typeof v === 'object' && v !== null) {
    const o = v as Record<string, unknown>;
    return {
      index: typeof o['index'] === 'number' ? Math.trunc(o['index']) : 0,
      time: typeof o['time'] === 'number' ? Math.trunc(o['time']) : 0,
    };
  }
  return { index: 0, time: 0 };
}

export function parseVanillaAnimationMcmeta(text: string): ParsedAnimationMcmeta {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new AnimationMcmetaParseError(`invalid JSON: ${String(e)}`);
  }
  if (typeof json !== 'object' || json === null)
    throw new AnimationMcmetaParseError('mcmeta must be an object');
  const animRaw = (json as Record<string, unknown>)['animation'];
  if (typeof animRaw !== 'object' || animRaw === null)
    throw new AnimationMcmetaParseError('missing "animation" object');
  const a = animRaw as Record<string, unknown>;
  const frametime = typeof a['frametime'] === 'number' ? Math.trunc(a['frametime']) : 1;
  const interpolate = a['interpolate'] === true;
  const width = typeof a['width'] === 'number' ? Math.trunc(a['width']) : null;
  const height = typeof a['height'] === 'number' ? Math.trunc(a['height']) : null;
  const frames: AnimationFrame[] = [];
  if (Array.isArray(a['frames'])) for (const f of a['frames']) frames.push(readFrame(f));
  return { frametime, interpolate, width, height, frames };
}

// Compute the per-frame display duration in ticks, expanding overrides.
export function frameDurations(meta: ParsedAnimationMcmeta): number[] {
  if (meta.frames.length === 0) return [];
  return meta.frames.map((f) => (f.time > 0 ? f.time : meta.frametime));
}

export function totalAnimationTicks(meta: ParsedAnimationMcmeta): number {
  let sum = 0;
  for (const t of frameDurations(meta)) sum += t;
  return sum;
}
