export interface LoomCraft {
  bannerBaseColor: string;
  dyeColor?: string;
  pattern?: string;
  specialTemplate?: string;
}

export const BASIC_PATTERNS = [
  'cross',
  'gradient',
  'stripe_center',
  'flower_charge',
  'creeper_charge',
];
export const SPECIAL_TEMPLATES = ['creeper', 'skull', 'flower', 'thing', 'globe', 'piglin'];

export function canApply(c: LoomCraft): boolean {
  if (!c.dyeColor) return false;
  if (c.specialTemplate) return SPECIAL_TEMPLATES.includes(c.specialTemplate);
  if (!c.pattern) return false;
  return BASIC_PATTERNS.includes(c.pattern);
}

export function consumesTemplate(): boolean {
  return true;
}
