// Entity glow outline (spectral arrow / glowing effect). Renders a
// team-colored or status-effect outline around an entity, visible
// through walls.

export type OutlineColor = 'white' | 'yellow' | 'red' | 'green' | 'blue' | 'gold' | 'magenta';

export interface GlowSource {
  fromSpectralArrow: boolean;
  fromStatusEffect: boolean;
  fromTeam: OutlineColor | null;
}

export function outlineColor(s: GlowSource): OutlineColor {
  if (s.fromTeam) return s.fromTeam;
  if (s.fromSpectralArrow || s.fromStatusEffect) return 'white';
  return 'white';
}

export function shouldRender(s: GlowSource): boolean {
  return s.fromSpectralArrow || s.fromStatusEffect || s.fromTeam !== null;
}

// Glowing effect duration from spectral arrow: 200 ticks (10s).
export const SPECTRAL_DURATION_TICKS = 200;

// Visible through walls? Yes for glowing effect.
export function visibleThroughWalls(s: GlowSource): boolean {
  return s.fromSpectralArrow || s.fromStatusEffect;
}
