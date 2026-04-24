export interface BiomeSample {
  biome: string;
  temperature: number;
  humidity: number;
}

export function blend(a: BiomeSample, b: BiomeSample, t: number): BiomeSample {
  return {
    biome: t < 0.5 ? a.biome : b.biome,
    temperature: a.temperature * (1 - t) + b.temperature * t,
    humidity: a.humidity * (1 - t) + b.humidity * t,
  };
}

export function isEdge(here: BiomeSample, neighbors: readonly BiomeSample[]): boolean {
  return neighbors.some((n) => n.biome !== here.biome);
}

export function edgeInterp(here: BiomeSample, neighbors: readonly BiomeSample[]): BiomeSample {
  if (neighbors.length === 0) return here;
  let t = 0;
  let h = 0;
  for (const n of neighbors) {
    t += n.temperature;
    h += n.humidity;
  }
  return {
    biome: here.biome,
    temperature: (here.temperature + t / neighbors.length) / 2,
    humidity: (here.humidity + h / neighbors.length) / 2,
  };
}
