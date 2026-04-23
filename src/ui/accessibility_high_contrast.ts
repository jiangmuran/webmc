export interface AccessCtx {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
}

export function outlineWidth(c: AccessCtx): number {
  return c.highContrast ? 3 : 1;
}

export function textScale(c: AccessCtx): number {
  return c.largeText ? 1.5 : 1;
}

export function animationScale(c: AccessCtx): number {
  return c.reduceMotion ? 0 : 1;
}
