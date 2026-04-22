// Bubble column. Soul sand produces upward column; magma block
// produces downward column. Entities caught are accelerated.

export type ColumnSource = 'soul_sand' | 'magma_block' | null;
export type Direction = 'up' | 'down';

export function directionOf(src: ColumnSource): Direction | null {
  if (src === 'soul_sand') return 'up';
  if (src === 'magma_block') return 'down';
  return null;
}

// Player vertical velocity when caught in the column.
export const UP_SPEED = 0.7;
export const DOWN_SPEED = -0.3;

export interface FlowQuery {
  source: ColumnSource;
  swimming: boolean;
}

export function verticalVelocity(q: FlowQuery): number {
  const d = directionOf(q.source);
  if (!d) return 0;
  return d === 'up' ? UP_SPEED : DOWN_SPEED;
}

// Bubble columns nullify fall damage if landed in water below.
export function cancelsFallDamage(q: FlowQuery): boolean {
  return q.source === 'soul_sand';
}

// Boats in a soul-sand column pop out of water; in magma column, sink.
export function boatBehavior(src: ColumnSource): 'pop' | 'sink' | 'normal' {
  if (src === 'soul_sand') return 'pop';
  if (src === 'magma_block') return 'sink';
  return 'normal';
}
