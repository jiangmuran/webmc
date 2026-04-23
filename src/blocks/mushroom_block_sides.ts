export interface Faces {
  up: boolean;
  down: boolean;
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export const ALL_INSIDE: Faces = {
  up: false,
  down: false,
  north: false,
  south: false,
  east: false,
  west: false,
};

export function exposedFaces(neighbors: Faces): Faces {
  return {
    up: !neighbors.up,
    down: !neighbors.down,
    north: !neighbors.north,
    south: !neighbors.south,
    east: !neighbors.east,
    west: !neighbors.west,
  };
}

export function dropsCount(faces: Faces, rng: () => number): number {
  const exposed = Object.values(faces).filter(Boolean).length;
  return Math.floor(rng() * exposed * 2);
}
