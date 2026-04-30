// Panda genetic personality. Each panda has a dominant + recessive
// gene that determine their visible personality. Babies inherit one
// gene from each parent randomly; if both recessive alleles match, the
// baby shows the recessive trait.

export type PandaGene = 'normal' | 'aggressive' | 'lazy' | 'worried' | 'playful' | 'weak' | 'brown';

// Wiki (minecraft.wiki/w/Panda#Genetics): only `brown` and `weak` are
// recessive. MC's actual visible-personality rule (not strict
// Mendelian) is:
//   - main gene dominant                                    → main
//   - main gene recessive AND hidden matches (homozygous)   → main
//   - main gene recessive AND hidden differs                → 'normal'
// Old code returned the OTHER allele when main was recessive and the
// other was dominant (so brown+aggressive → aggressive). MC actually
// falls back to 'normal' for heterozygous-recessive, regardless of
// what the dominant allele is. Sibling panda_personality_breed.ts
// implements the wiki rule.
const RECESSIVE_ONLY = new Set<PandaGene>(['brown', 'weak']);

export function visiblePersonality(dominant: PandaGene, recessive: PandaGene): PandaGene {
  if (!RECESSIVE_ONLY.has(dominant)) return dominant;
  if (dominant === recessive) return dominant;
  return 'normal';
}

// Child inherits one gene from each parent with 50/50 probability.
export interface ParentPair {
  parentA: { dominant: PandaGene; recessive: PandaGene };
  parentB: { dominant: PandaGene; recessive: PandaGene };
  rng: () => number;
}

export interface ChildGenotype {
  dominant: PandaGene;
  recessive: PandaGene;
}

export function breedPanda(q: ParentPair): ChildGenotype {
  const fromA = q.rng() < 0.5 ? q.parentA.dominant : q.parentA.recessive;
  const fromB = q.rng() < 0.5 ? q.parentB.dominant : q.parentB.recessive;
  return { dominant: fromA, recessive: fromB };
}

// Random wild panda (used by world spawn).
const WILD_DISTRIBUTION: readonly { gene: PandaGene; weight: number }[] = [
  { gene: 'normal', weight: 45 },
  { gene: 'aggressive', weight: 10 },
  { gene: 'lazy', weight: 10 },
  { gene: 'worried', weight: 10 },
  { gene: 'playful', weight: 10 },
  { gene: 'weak', weight: 7 },
  { gene: 'brown', weight: 8 },
];

function pickWildGene(rng: () => number): PandaGene {
  const total = WILD_DISTRIBUTION.reduce((s, e) => s + e.weight, 0);
  const target = rng() * total;
  let acc = 0;
  for (const e of WILD_DISTRIBUTION) {
    acc += e.weight;
    if (target < acc) return e.gene;
  }
  return 'normal';
}

export function wildPandaGenotype(rng: () => number): ChildGenotype {
  return { dominant: pickWildGene(rng), recessive: pickWildGene(rng) };
}
