// Clock item. Renders an analog dial showing the time of day (sun
// position). The dial has 64 "frames" mapped to normalized time [0, 1).
// In the Nether and End, the clock spins randomly because the sun does
// not rise there.

export const CLOCK_FRAMES = 64;

export interface ClockQuery {
  dimension: string;
  normalizedTime: number; // [0, 1)
}

export function clockFrame(q: ClockQuery): number {
  if (q.dimension === 'nether' || q.dimension === 'the_end') {
    return Math.floor(Math.random() * CLOCK_FRAMES);
  }
  const t = ((q.normalizedTime % 1) + 1) % 1;
  return Math.floor(t * CLOCK_FRAMES) % CLOCK_FRAMES;
}

// Moon phase counter: 0..7; phase 0 = full moon. Phantoms spawn more
// often on certain phases.
export function moonPhase(dayNumber: number): number {
  return ((dayNumber % 8) + 8) % 8;
}

export function isFullMoon(dayNumber: number): boolean {
  return moonPhase(dayNumber) === 0;
}
