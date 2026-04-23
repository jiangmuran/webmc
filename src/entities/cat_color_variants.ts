export type CatVariant =
  | 'black'
  | 'british_shorthair'
  | 'calico'
  | 'jellie'
  | 'persian'
  | 'ragdoll'
  | 'red'
  | 'siamese'
  | 'tabby'
  | 'tuxedo'
  | 'white';

const ALL: CatVariant[] = [
  'black',
  'british_shorthair',
  'calico',
  'jellie',
  'persian',
  'ragdoll',
  'red',
  'siamese',
  'tabby',
  'tuxedo',
  'white',
];

export function villageVariant(rng: () => number): CatVariant {
  return ALL[Math.floor(rng() * ALL.length)] ?? 'black';
}

export function swampHutAlwaysBlack(): CatVariant {
  return 'black';
}

export function allVariants(): readonly CatVariant[] {
  return ALL;
}
