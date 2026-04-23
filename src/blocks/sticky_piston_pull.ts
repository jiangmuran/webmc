export const STICKY_PULL_BLOCKS = 1;
export const SLIME_BLOCK_CHAIN = true;

export function pullsAttached(block: string): boolean {
  return block !== 'air';
}

export function slimeBlockChained(block: string): boolean {
  return block === 'slime_block' || block === 'honey_block';
}

export function slimeAndHoneyCollide(a: string, b: string): boolean {
  return (
    (a === 'slime_block' && b === 'honey_block') || (b === 'slime_block' && a === 'honey_block')
  );
}
