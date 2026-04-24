export const DEFAULT_SIMULATION_DISTANCE = 10;
export const MIN_SIMULATION_DISTANCE = 4;
export const MAX_SIMULATION_DISTANCE = 32;

export function clamp(distance: number): number {
  return Math.max(MIN_SIMULATION_DISTANCE, Math.min(MAX_SIMULATION_DISTANCE, distance));
}

export function inSimulationDistance(
  chunkX: number,
  chunkZ: number,
  playerChunkX: number,
  playerChunkZ: number,
  simulationDistance: number,
): boolean {
  const chebyshev = Math.max(Math.abs(chunkX - playerChunkX), Math.abs(chunkZ - playerChunkZ));
  return chebyshev <= simulationDistance;
}

export function chunksInSimulationDistance(simulationDistance: number): number {
  const side = simulationDistance * 2 + 1;
  return side * side;
}
