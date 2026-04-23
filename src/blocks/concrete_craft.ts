// Concrete powder craft: sand + gravel + dye → 8 concrete powder.

export const CONCRETE_POWDER_RECIPE = {
  inputs: { sand: 4, gravel: 4, dye: 1 },
  output: 8,
};

export function canCraft(sand: number, gravel: number, dye: number): boolean {
  return sand >= 4 && gravel >= 4 && dye >= 1;
}

export function outputCount(): number {
  return CONCRETE_POWDER_RECIPE.output;
}

export const COLORS = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black',
];

export function concretePowderIdFor(color: string): string | null {
  return COLORS.includes(color) ? `concrete_powder_${color}` : null;
}
