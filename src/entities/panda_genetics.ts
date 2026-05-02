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

// Wiki (minecraft.wiki/w/Panda#Genetics): "These probabilities also
// apply to naturally spawned pandas for their main and hidden genes."
// The "probabilities" referenced are the mutated-gene distribution
// table:
//   Normal      5/16
//   Aggressive  1/16
//   Lazy        1/16
//   Worried     1/16
//   Playful     1/16
//   Weak        5/16
//   Brown       2/16
//
// Old WILD_DISTRIBUTION (45/10/10/10/10/7/8 out of 100) over-weighted
// normal (45% vs wiki's 31.25%), under-weighted weak (7% vs 31.25%),
// and skewed brown (8% vs 12.5%). Visible weak pandas appeared at
// (7/100)² ≈ 0.49% of spawns instead of the wiki-implied
// (5/16)² ≈ 9.77% — ~20× rarer than canon.
const WILD_DISTRIBUTION: readonly { gene: PandaGene; weight: number }[] = [
  { gene: 'normal', weight: 5 },
  { gene: 'aggressive', weight: 1 },
  { gene: 'lazy', weight: 1 },
  { gene: 'worried', weight: 1 },
  { gene: 'playful', weight: 1 },
  { gene: 'weak', weight: 5 },
  { gene: 'brown', weight: 2 },
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
