export interface IceSpikeParams {
  isIceSpikesBiome: boolean;
  rng: () => number;
}

export function shouldPlaceSpike(p: IceSpikeParams): boolean {
  if (!p.isIceSpikesBiome) return false;
  return p.rng() < 1 / 24;
}

export function spikeHeight(p: IceSpikeParams): number {
  return 7 + Math.floor(p.rng() * 5);
}

export function isTallSpike(p: IceSpikeParams): boolean {
  return p.isIceSpikesBiome && p.rng() < 1 / 60;
}

export function tallSpikeHeight(p: IceSpikeParams): number {
  return 12 + Math.floor(p.rng() * 6);
}
