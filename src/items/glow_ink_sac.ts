// Glow ink sac from glow squids. Applies glow to signs/item frames.

export interface GlowApplyQuery {
  target: 'sign' | 'item_frame' | 'other';
  alreadyGlowing: boolean;
}

export type GlowResult =
  | { kind: 'applied' }
  | { kind: 'already_glowing' }
  | { kind: 'invalid_target' };

export function applyTo(q: GlowApplyQuery): GlowResult {
  if (q.target === 'other') return { kind: 'invalid_target' };
  if (q.alreadyGlowing) return { kind: 'already_glowing' };
  return { kind: 'applied' };
}

export function removeWithInk(currentlyGlowing: boolean): boolean {
  return currentlyGlowing;
}
