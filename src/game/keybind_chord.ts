// Key chords. Some bindings combine modifiers (Shift/Ctrl/Alt). A
// chord matches if the held set matches exactly (ignoring irrelevant
// modifiers when flagged).

export interface Chord {
  key: string;
  shift?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  // if true, ignore modifiers not explicitly in this chord
  anyModifiers?: boolean;
}

export interface KeyState {
  key: string;
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
}

export function matches(c: Chord, s: KeyState): boolean {
  if (c.key !== s.key) return false;
  if (c.anyModifiers) return true;
  const want = (v?: boolean) => !!v;
  return want(c.shift) === s.shift && want(c.ctrl) === s.ctrl && want(c.alt) === s.alt;
}

export function matchesAny(cs: Chord[], s: KeyState): Chord | null {
  // Prefer stricter matches (more modifier constraints) first.
  const sorted = [...cs].sort((a, b) => modifierCount(b) - modifierCount(a));
  for (const c of sorted) {
    if (matches(c, s)) return c;
  }
  return null;
}

function modifierCount(c: Chord): number {
  return (c.shift ? 1 : 0) + (c.ctrl ? 1 : 0) + (c.alt ? 1 : 0);
}
