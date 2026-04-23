export const LIGHTNING_DAMAGE = 5;
export const LIGHTNING_FIRE_RADIUS = 4;

export interface LightningEffect {
  ignitesFire: boolean;
  chargesCreeper: boolean;
  convertsMooshroom: boolean;
  convertsVillager: boolean;
  convertsPig: boolean;
  convertsTurtle: boolean;
}

export function effectOnTarget(target: string): LightningEffect {
  return {
    ignitesFire: true,
    chargesCreeper: target === 'creeper',
    convertsMooshroom: target === 'mooshroom',
    convertsVillager: target === 'villager',
    convertsPig: target === 'pig',
    convertsTurtle: false,
  };
}

export function targetTransformation(target: string): string | undefined {
  if (target === 'creeper') return 'charged_creeper';
  if (target === 'mooshroom') return 'brown_mooshroom';
  if (target === 'villager') return 'witch';
  if (target === 'pig') return 'zombified_piglin';
  return undefined;
}
