// Torchflower crop. Planted from torchflower_seeds on farmland.
// Age 0-1; age 1 drops torchflower plant block on harvest.

export interface TorchflowerCrop {
  age: 0 | 1;
  onFarmland: boolean;
}

export function canGrow(c: TorchflowerCrop): boolean {
  return c.onFarmland && c.age === 0;
}

export function tryGrow(c: TorchflowerCrop, rand: () => number): TorchflowerCrop {
  if (!canGrow(c)) return c;
  if (rand() < 0.125) return { ...c, age: 1 };
  return c;
}

export function harvest(c: TorchflowerCrop): 'torchflower' | 'seed_back' {
  return c.age === 1 ? 'torchflower' : 'seed_back';
}
