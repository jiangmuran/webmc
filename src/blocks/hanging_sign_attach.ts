// Hanging sign attachment. Can hang from the bottom of a solid block
// (ceiling), from a horizontal side of a solid block (arm), or between
// two sides via chain attachment.

export type HangingAttachment =
  | { kind: 'ceiling'; centered: boolean }
  | { kind: 'wall_arm'; facing: 'north' | 'east' | 'south' | 'west' }
  | { kind: 'chain_double' };

export interface AttachQuery {
  solidAbove: boolean;
  solidSides: boolean[]; // 4 directions
}

export function pickAttachment(q: AttachQuery): HangingAttachment | null {
  if (q.solidAbove) return { kind: 'ceiling', centered: true };
  const idx = q.solidSides.findIndex(Boolean);
  if (idx === -1) return null;
  const dirs: ('north' | 'east' | 'south' | 'west')[] = ['north', 'east', 'south', 'west'];
  return { kind: 'wall_arm', facing: dirs[idx] ?? 'north' };
}

export function canWaxInk(): boolean {
  return true;
}

export const HANGING_SIGN_LINES = 4;
export const HANGING_SIGN_MAX_CHARS_PER_LINE = 20;
