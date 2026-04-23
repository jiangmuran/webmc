// Axolotl bucket: water bucket + axolotl → axolotl_bucket NBT preserves
// variant, age, name, health.

export type AxolotlVariant = 'lucy' | 'wild' | 'gold' | 'cyan' | 'blue';

export interface AxolotlNbt {
  variant: AxolotlVariant;
  age: number;
  customName: string | null;
  health: number;
}

export function bucketize(a: AxolotlNbt): { item: 'axolotl_bucket'; nbt: AxolotlNbt } {
  return { item: 'axolotl_bucket', nbt: { ...a } };
}

export function releaseFromBucket(nbt: AxolotlNbt): AxolotlNbt {
  return { ...nbt };
}

export const AXOLOTL_BUCKET_STACK_MAX = 1;
