export const MIN = 6;
export const MAX = 9;

export interface Cherry {
  height: number;
  branchCount: number;
  foliageRadius: number;
}

export function rollCherry(rng: () => number): Cherry {
  return {
    height: MIN + Math.floor(rng() * (MAX - MIN + 1)),
    branchCount: 2 + Math.floor(rng() * 3),
    foliageRadius: 3,
  };
}

export function leavesAreTinted(): boolean {
  return true;
}

export function leavesDropPetalParticle(rng: () => number): boolean {
  return rng() < 0.05;
}
