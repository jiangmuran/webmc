// Panda breeding + personality inheritance. Each panda has a
// main + hidden gene. Child randomly picks from each parent.
// Visible personality = main if dominant or main==hidden, else recessive.

export type Gene = 'normal' | 'aggressive' | 'lazy' | 'worried' | 'playful' | 'weak' | 'brown';

// Brown and weak are recessive, everything else is dominant.
const RECESSIVE = new Set<Gene>(['brown', 'weak']);

export function isDominant(g: Gene): boolean {
  return !RECESSIVE.has(g);
}

export interface Panda {
  mainGene: Gene;
  hiddenGene: Gene;
}

export function visiblePersonality(p: Panda): Gene {
  if (isDominant(p.mainGene)) return p.mainGene;
  if (p.mainGene === p.hiddenGene) return p.mainGene;
  return 'normal';
}

export interface BreedQuery {
  parentA: Panda;
  parentB: Panda;
  rand: () => number;
}

export function breedChild(q: BreedQuery): Panda {
  const mainFromA = q.rand() < 0.5;
  const hiddenFromA = q.rand() < 0.5;
  // small mutation chance (~0.01) yields recessive brown.
  const mutate = q.rand() < 0.01;
  return {
    mainGene: mutate ? 'brown' : mainFromA ? q.parentA.mainGene : q.parentB.mainGene,
    hiddenGene: hiddenFromA ? q.parentA.hiddenGene : q.parentB.hiddenGene,
  };
}
