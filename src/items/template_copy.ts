// Smithing template duplication. Craft: 1 template + 7 diamonds + matching
// base material → 2 copies of the same template (+ returns the original).
//
// Wiki additions for 1.21 trial-chamber trims:
//   - flow_trim duplicates with a breeze_rod
//     (minecraft.wiki/w/Flow_Armor_Trim: "duplicated using an existing
//     template, a breeze rod, and seven diamonds.")
//   - bolt_trim duplicates with a copper_block
//     (minecraft.wiki/w/Bolt_Armor_Trim: "duplicated using ... a block
//     of copper or waxed block of copper, and diamonds.")
// Old union/material map omitted both, so 1.21 players couldn't
// duplicate Trial Chamber trim templates.

export type TemplateKind =
  | 'netherite_upgrade'
  | 'coast_trim'
  | 'dune_trim'
  | 'eye_trim'
  | 'host_trim'
  | 'raiser_trim'
  | 'rib_trim'
  | 'sentry_trim'
  | 'shaper_trim'
  | 'silence_trim'
  | 'snout_trim'
  | 'spire_trim'
  | 'tide_trim'
  | 'vex_trim'
  | 'ward_trim'
  | 'wayfinder_trim'
  | 'wild_trim'
  | 'flow_trim'
  | 'bolt_trim';

const BASE_MATERIAL: Record<TemplateKind, string> = {
  netherite_upgrade: 'webmc:netherrack',
  coast_trim: 'webmc:cobblestone',
  dune_trim: 'webmc:sandstone',
  eye_trim: 'webmc:end_stone',
  host_trim: 'webmc:terracotta',
  raiser_trim: 'webmc:terracotta',
  rib_trim: 'webmc:netherrack',
  sentry_trim: 'webmc:cobblestone',
  shaper_trim: 'webmc:terracotta',
  silence_trim: 'webmc:cobbled_deepslate',
  snout_trim: 'webmc:blackstone',
  spire_trim: 'webmc:purpur_block',
  tide_trim: 'webmc:prismarine',
  vex_trim: 'webmc:cobblestone',
  ward_trim: 'webmc:cobbled_deepslate',
  wayfinder_trim: 'webmc:terracotta',
  wild_trim: 'webmc:mossy_cobblestone',
  flow_trim: 'webmc:breeze_rod',
  bolt_trim: 'webmc:copper_block',
};

export function baseMaterialFor(kind: TemplateKind): string {
  return BASE_MATERIAL[kind];
}

export interface DuplicateQuery {
  template: TemplateKind;
  diamonds: number;
  baseMaterial: string;
}

export interface DuplicateResult {
  copiesProduced: number;
  consumesDiamonds: number;
}

const DIAMONDS_PER_COPY = 7;

export function duplicateTemplate(q: DuplicateQuery): DuplicateResult {
  if (q.baseMaterial !== BASE_MATERIAL[q.template]) {
    return { copiesProduced: 0, consumesDiamonds: 0 };
  }
  if (q.diamonds < DIAMONDS_PER_COPY) {
    return { copiesProduced: 0, consumesDiamonds: 0 };
  }
  return { copiesProduced: 2, consumesDiamonds: DIAMONDS_PER_COPY };
}
