// Splash screen messages. Randomized one-line "splash" text under the
// main menu logo. Picks one on title load; color + scale animated for
// fun. Some splashes are date-locked (birthday, April Fools).

export interface SplashEntry {
  text: string;
  // If non-null, only picked when `now` falls within ±rangeDays of the key
  // date. MM-DD format (year-agnostic).
  dateLocked: string | null;
  weight: number;
}

export const SPLASHES: readonly SplashEntry[] = [
  { text: 'Also try Minceraft!', dateLocked: null, weight: 10 },
  { text: 'Indev!', dateLocked: null, weight: 10 },
  { text: 'Water-proof blocks!', dateLocked: null, weight: 10 },
  { text: 'Open-source!', dateLocked: null, weight: 10 },
  { text: 'Completely web-based!', dateLocked: null, weight: 10 },
  { text: '60 FPS on desktop!', dateLocked: null, weight: 10 },
  { text: '30 FPS on mobile!', dateLocked: null, weight: 10 },
  { text: 'Bring back the nostalgia!', dateLocked: null, weight: 10 },
  { text: 'Creep-tacular!', dateLocked: null, weight: 10 },
  { text: 'Build a redstone computer!', dateLocked: null, weight: 5 },
  { text: 'Happy Birthday!', dateLocked: '05-17', weight: 100 },
  { text: 'April Fools!', dateLocked: '04-01', weight: 100 },
  { text: 'Merry Christmas!', dateLocked: '12-25', weight: 100 },
  { text: 'Now with more diamonds!', dateLocked: null, weight: 5 },
  { text: 'Clean-room reimplementation!', dateLocked: null, weight: 5 },
];

export interface PickQuery {
  nowMonthDay: string; // "MM-DD"
  rng: () => number;
}

export function pickSplash(q: PickQuery): SplashEntry {
  const candidates = SPLASHES.filter(
    (s) => s.dateLocked === null || s.dateLocked === q.nowMonthDay,
  );
  const total = candidates.reduce((sum, c) => sum + c.weight, 0);
  const target = q.rng() * total;
  let acc = 0;
  for (const c of candidates) {
    acc += c.weight;
    if (target < acc) return c;
  }
  return candidates[0] ?? { text: 'webmc!', dateLocked: null, weight: 1 };
}

// Animation state: subtle scale pulse at 2 Hz. Returns scale multiplier
// for the current time.
export function splashScalePulse(tSec: number): number {
  return 1 + 0.08 * Math.sin(tSec * Math.PI * 4);
}

// Rotation: tilted 20° for retro look.
export const SPLASH_ROTATION_DEG = -20;
