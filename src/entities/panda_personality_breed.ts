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

// Wiki (minecraft.wiki/w/Panda#Genetics): "There is also a 1/32 chance
// for each gene of the baby to mutate into another gene. Normal, weak,
// and brown traits more commonly result from mutations than other
// traits do." The mutated-gene distribution table is:
//   Normal      5/16
//   Aggressive  1/16
//   Lazy        1/16
//   Worried     1/16
//   Playful     1/16
//   Weak        5/16
//   Brown       2/16
//
// Old code: 1% chance (~3× under wiki's 1/32 = 3.125%), and on mutate
// always returned 'brown' (which the wiki gives only 12.5% of mutations,
// not 100%). Effect: brown pandas appeared at ~3× their wiki rate
// when bred and almost never as the result of weak/normal mutations,
// making weak pandas in particular far rarer than canon.
export const MUTATION_CHANCE = 1 / 32;
const MUTATED_GENE_TABLE: readonly { gene: Gene; weight16: number }[] = [
  { gene: 'normal', weight16: 5 },
  { gene: 'aggressive', weight16: 1 },
  { gene: 'lazy', weight16: 1 },
  { gene: 'worried', weight16: 1 },
  { gene: 'playful', weight16: 1 },
  { gene: 'weak', weight16: 5 },
  { gene: 'brown', weight16: 2 },
];

function pickMutatedGene(rand: () => number): Gene {
  const r = rand() * 16;
  let acc = 0;
  for (const e of MUTATED_GENE_TABLE) {
    acc += e.weight16;
    if (r < acc) return e.gene;
  }
  return 'normal';
}

function inheritGene(parentMain: Gene, parentHidden: Gene, rand: () => number): Gene {
  const inherit = rand() < 0.5 ? parentMain : parentHidden;
  if (rand() < MUTATION_CHANCE) return pickMutatedGene(rand);
  return inherit;
}

export function breedChild(q: BreedQuery): Panda {
  return {
    mainGene: inheritGene(q.parentA.mainGene, q.parentA.hiddenGene, q.rand),
    hiddenGene: inheritGene(q.parentB.mainGene, q.parentB.hiddenGene, q.rand),
  };
}
