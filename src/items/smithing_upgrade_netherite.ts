export interface SmithingInput {
  base: string;
  template: string;
  addition: string;
}

export function isNetheriteUpgrade(s: SmithingInput): boolean {
  if (s.template !== 'netherite_upgrade_smithing_template') return false;
  if (s.addition !== 'netherite_ingot') return false;
  return s.base.startsWith('diamond_');
}

export function upgradedName(s: SmithingInput): string | undefined {
  if (!isNetheriteUpgrade(s)) return undefined;
  return s.base.replace(/^diamond_/, 'netherite_');
}

export function preservesEnchantments(): boolean {
  return true;
}
