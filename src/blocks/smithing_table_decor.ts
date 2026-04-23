export function villagerProfession(): string {
  return 'toolsmith';
}

export function claimsAsPoi(): boolean {
  return true;
}

export function recipeGUI(): 'none' | 'smithing' {
  return 'smithing';
}

export function emitsWorkSound(): string {
  return 'block.smithing_table.use';
}
