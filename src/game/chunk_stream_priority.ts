// Chunk stream-in priority. When catching up after a player teleport,
// stream closer chunks first; subsequent ones form a spiral outward.

export interface StreamPlan {
  cx: number;
  cz: number;
  distance: number; // squared
}

export function planSpiral(centerCx: number, centerCz: number, radius: number): StreamPlan[] {
  const out: StreamPlan[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const cx = centerCx + dx;
      const cz = centerCz + dz;
      const d2 = dx * dx + dz * dz;
      if (d2 <= radius * radius) {
        out.push({ cx, cz, distance: d2 });
      }
    }
  }
  out.sort((a, b) => a.distance - b.distance);
  return out;
}

// Catch-up batching: deliver first N chunks immediately, then 3 per frame.
export const INITIAL_BURST = 25;
export const PER_FRAME = 3;

export interface Batch {
  send: StreamPlan[];
  remaining: StreamPlan[];
}

export function pickBatch(all: StreamPlan[], hasSentInitial: boolean): Batch {
  const count = hasSentInitial ? PER_FRAME : INITIAL_BURST;
  return { send: all.slice(0, count), remaining: all.slice(count) };
}
