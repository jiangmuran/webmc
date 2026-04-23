export type Dir = 'north' | 'south' | 'east' | 'west';

export interface Neighbors {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  above: boolean;
}

export interface WallShape {
  tall: boolean;
  connections: Record<Dir, 'none' | 'low' | 'tall'>;
}

function sideHeight(connected: boolean, postNeeded: boolean): 'none' | 'low' | 'tall' {
  if (!connected) return 'none';
  return postNeeded ? 'tall' : 'low';
}

export function computeShape(n: Neighbors): WallShape {
  const pairStraight =
    (n.north && n.south && !n.east && !n.west) || (n.east && n.west && !n.north && !n.south);
  const needsTallPost = n.above || !pairStraight;
  return {
    tall: needsTallPost,
    connections: {
      north: sideHeight(n.north, needsTallPost),
      south: sideHeight(n.south, needsTallPost),
      east: sideHeight(n.east, needsTallPost),
      west: sideHeight(n.west, needsTallPost),
    },
  };
}
