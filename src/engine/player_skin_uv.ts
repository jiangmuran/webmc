// Player skin 64x64 UV layout. Returns (u,v,w,h) atlas regions for
// each body part face. Slim vs classic arm width differs by 1 pixel.

export type SkinFace =
  | 'head_front'
  | 'head_back'
  | 'head_top'
  | 'head_bottom'
  | 'head_left'
  | 'head_right'
  | 'body_front'
  | 'body_back'
  | 'arm_right_front'
  | 'arm_left_front'
  | 'leg_right_front'
  | 'leg_left_front';

export interface UvRect {
  u: number;
  v: number;
  w: number;
  h: number;
}

export function rectFor(face: SkinFace, slim: boolean): UvRect {
  const armW = slim ? 3 : 4;
  switch (face) {
    case 'head_front':
      return { u: 8, v: 8, w: 8, h: 8 };
    case 'head_back':
      return { u: 24, v: 8, w: 8, h: 8 };
    case 'head_top':
      return { u: 8, v: 0, w: 8, h: 8 };
    case 'head_bottom':
      return { u: 16, v: 0, w: 8, h: 8 };
    case 'head_left':
      return { u: 16, v: 8, w: 8, h: 8 };
    case 'head_right':
      return { u: 0, v: 8, w: 8, h: 8 };
    case 'body_front':
      return { u: 20, v: 20, w: 8, h: 12 };
    case 'body_back':
      return { u: 32, v: 20, w: 8, h: 12 };
    case 'arm_right_front':
      return { u: 44, v: 20, w: armW, h: 12 };
    case 'arm_left_front':
      return { u: 36, v: 52, w: armW, h: 12 };
    case 'leg_right_front':
      return { u: 4, v: 20, w: 4, h: 12 };
    case 'leg_left_front':
      return { u: 20, v: 52, w: 4, h: 12 };
  }
}

export const SKIN_PIXEL_SIZE = 64;

export function normalize(r: UvRect): { u: number; v: number; w: number; h: number } {
  return {
    u: r.u / SKIN_PIXEL_SIZE,
    v: r.v / SKIN_PIXEL_SIZE,
    w: r.w / SKIN_PIXEL_SIZE,
    h: r.h / SKIN_PIXEL_SIZE,
  };
}
