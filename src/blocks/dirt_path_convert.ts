export interface ShovelUse {
  target: string;
  topBlockIsAir: boolean;
}

export const CONVERTIBLE = new Set(['grass_block', 'dirt', 'podzol', 'mycelium', 'coarse_dirt', 'rooted_dirt']);

export function canConvert(u: ShovelUse): boolean {
  return u.topBlockIsAir && CONVERTIBLE.has(u.target);
}

export function convertedBlock(): string {
  return 'dirt_path';
}

export function tramplingPreventedByFarmland(): boolean {
  return false;
}
