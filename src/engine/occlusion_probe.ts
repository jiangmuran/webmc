// Chunk-chunk occlusion probe. Maintain an N×N×N visibility graph
// between sub-chunk faces (pre-computed with flood fill during meshing).

export type Face = 0 | 1 | 2 | 3 | 4 | 5; // +x -x +y -y +z -z

export interface FaceConnectivity {
  // connectivity[a][b] = can light/visibility pass from face a to face b through this sub-chunk
  connectivity: boolean[][];
}

export function makeFullConnectivity(): FaceConnectivity {
  const rows: boolean[][] = [];
  for (let a = 0; a < 6; a++) {
    const row: boolean[] = [];
    for (let b = 0; b < 6; b++) row.push(true);
    rows.push(row);
  }
  return { connectivity: rows };
}

export function setConnected(c: FaceConnectivity, a: Face, b: Face, v: boolean): void {
  const rowA = c.connectivity[a];
  const rowB = c.connectivity[b];
  if (!rowA || !rowB) return;
  rowA[b] = v;
  rowB[a] = v;
}

export function connected(c: FaceConnectivity, a: Face, b: Face): boolean {
  return c.connectivity[a]?.[b] ?? false;
}

export function invertedFace(f: Face): Face {
  return (f ^ 1) as Face;
}
