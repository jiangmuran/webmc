export interface SignState {
  text: string[];
  color: string;
  glowing: boolean;
  waxed: boolean;
}

export function canEdit(s: SignState): boolean {
  return !s.waxed;
}

export function applyWax(s: SignState): SignState {
  return { ...s, waxed: true };
}

export function honeycombUsed(item: string): boolean {
  return item === 'honeycomb';
}

export function dyeApplied(s: SignState, dye: string): SignState {
  if (s.waxed) return s;
  return { ...s, color: dye };
}
