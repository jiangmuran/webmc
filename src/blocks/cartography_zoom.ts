// Cartography table. Zoom out (cap 4), copy, lock, mark.

export type CartographyOp =
  | { kind: 'zoom_out'; from: number }
  | { kind: 'copy' }
  | { kind: 'lock' }
  | { kind: 'mark_glass_pane' }
  | { kind: 'invalid' };

export const MAP_MAX_SCALE = 4;

export function opForInputs(
  leftItem: string,
  rightItem: string,
  rightMapScale: number,
): CartographyOp {
  if (leftItem === 'filled_map' && rightItem === 'paper') {
    if (rightMapScale >= MAP_MAX_SCALE) return { kind: 'invalid' };
    return { kind: 'zoom_out', from: rightMapScale };
  }
  if (leftItem === 'filled_map' && rightItem === 'empty_map') return { kind: 'copy' };
  if (leftItem === 'filled_map' && rightItem === 'glass_pane') return { kind: 'lock' };
  return { kind: 'invalid' };
}

export function nextScale(current: number): number {
  return Math.min(MAP_MAX_SCALE, current + 1);
}

export function requiresUnlocked(op: CartographyOp): boolean {
  return op.kind === 'zoom_out';
}
