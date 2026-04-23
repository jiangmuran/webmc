export type Face = 'north' | 'south' | 'east' | 'west' | 'up';

export interface VineCtx {
  attachedFaces: Set<Face>;
}

export function hasAttachment(c: VineCtx): boolean {
  return c.attachedFaces.size > 0;
}

export function canSpread(c: VineCtx, rng: () => number): boolean {
  return hasAttachment(c) && rng() < 0.25;
}

export function breaksIfNoAttachment(c: VineCtx): boolean {
  return !hasAttachment(c);
}

export function silkTouchRequired(): boolean {
  return true;
}
