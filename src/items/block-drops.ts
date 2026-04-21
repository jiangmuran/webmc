import type { BlockId } from '@/blocks/state';
import type { ItemId, ItemStack } from './item';
import { stack } from './item';

export interface DropRule {
  itemId: ItemId;
  min: number;
  max: number;
  requiresToolTier?: number;
  requiresToolKind?: 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword';
}

export class BlockDropRegistry {
  private readonly rules = new Map<BlockId, DropRule[]>();

  register(blockId: BlockId, rules: DropRule[]): void {
    this.rules.set(blockId, rules);
  }

  // Returns the items dropped when `blockId` is broken by a tool of the given
  // kind + tier. Tier 0 = bare hand, 1 = wood, 2 = stone, 3 = iron, etc.
  drops(
    blockId: BlockId,
    toolKind: DropRule['requiresToolKind'] | undefined,
    toolTier: number,
    rng: () => number = Math.random,
  ): ItemStack[] {
    const rules = this.rules.get(blockId);
    if (!rules) return [];
    const out: ItemStack[] = [];
    for (const rule of rules) {
      if (rule.requiresToolKind && rule.requiresToolKind !== toolKind) continue;
      if (rule.requiresToolTier && toolTier < rule.requiresToolTier) continue;
      const count =
        rule.min === rule.max ? rule.min : rule.min + Math.floor(rng() * (rule.max - rule.min + 1));
      if (count > 0) out.push(stack(rule.itemId, count));
    }
    return out;
  }
}
