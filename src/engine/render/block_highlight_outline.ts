export interface HighlightInput {
  hoveredBlockId: string;
  hoveredX: number;
  hoveredY: number;
  hoveredZ: number;
  hoveredFace?: 'px' | 'nx' | 'py' | 'ny' | 'pz' | 'nz';
  reach: number;
  distance: number;
}

export function shouldShowOutline(i: HighlightInput): boolean {
  if (i.hoveredBlockId === 'air') return false;
  return i.distance <= i.reach;
}

export function outlineColor(i: HighlightInput): [number, number, number, number] {
  if (!shouldShowOutline(i)) return [0, 0, 0, 0];
  return [0, 0, 0, 0.75];
}

export function outlineThicknessPx(): number {
  return 1;
}
