// Spatial hash grid. Buckets entities by cell coords for fast
// neighbor queries within a fixed cell size.

export interface HashGrid<T> {
  cellSize: number;
  cells: Map<string, T[]>;
}

export function makeGrid<T>(cellSize: number): HashGrid<T> {
  return { cellSize, cells: new Map() };
}

function cellKey(cellSize: number, x: number, y: number, z: number): string {
  const cx = Math.floor(x / cellSize);
  const cy = Math.floor(y / cellSize);
  const cz = Math.floor(z / cellSize);
  return `${cx},${cy},${cz}`;
}

export function insert<T>(g: HashGrid<T>, item: T, x: number, y: number, z: number): void {
  const k = cellKey(g.cellSize, x, y, z);
  const arr = g.cells.get(k) ?? [];
  arr.push(item);
  g.cells.set(k, arr);
}

export function clear<T>(g: HashGrid<T>): void {
  g.cells.clear();
}

export function queryBox<T>(
  g: HashGrid<T>,
  minX: number,
  minY: number,
  minZ: number,
  maxX: number,
  maxY: number,
  maxZ: number,
): T[] {
  const out: T[] = [];
  const seen = new Set<T>();
  const cs = g.cellSize;
  for (let x = Math.floor(minX / cs); x <= Math.floor(maxX / cs); x++) {
    for (let y = Math.floor(minY / cs); y <= Math.floor(maxY / cs); y++) {
      for (let z = Math.floor(minZ / cs); z <= Math.floor(maxZ / cs); z++) {
        const arr = g.cells.get(`${x},${y},${z}`);
        if (!arr) continue;
        for (const item of arr) {
          if (!seen.has(item)) {
            seen.add(item);
            out.push(item);
          }
        }
      }
    }
  }
  return out;
}

export function totalCells<T>(g: HashGrid<T>): number {
  return g.cells.size;
}
