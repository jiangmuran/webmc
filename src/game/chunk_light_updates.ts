// Chunk light update queue. Sky + block light run as separate BFS.
// Batch updates to one tick per update.

export interface LightUpdate {
  x: number;
  y: number;
  z: number;
  kind: 'sky' | 'block';
  newLight: number; // 0..15
}

export class LightUpdateQueue {
  private entries: LightUpdate[] = [];

  enqueue(u: LightUpdate): void {
    this.entries.push(u);
  }

  drain(max = 500): LightUpdate[] {
    const out = this.entries.slice(0, max);
    this.entries = this.entries.slice(max);
    return out;
  }

  get size(): number {
    return this.entries.length;
  }

  clear(): void {
    this.entries = [];
  }
}

// Recompute a single cell's incoming sky light from neighbors (min-15
// max-0 attenuation-of-1).
export interface LightNeighbors {
  north: number;
  south: number;
  east: number;
  west: number;
  up: number;
  down: number;
}

export function computeLightFromNeighbors(n: LightNeighbors, emission: number): number {
  const maxN = Math.max(n.north, n.south, n.east, n.west, n.up, n.down);
  return Math.max(emission, Math.max(0, maxN - 1));
}
