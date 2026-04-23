// Loot condition predicate. Used by loot tables to gate entries.

export type LootCondition =
  | { kind: 'random_chance'; chance: number }
  | { kind: 'killed_by_player' }
  | { kind: 'entity_property'; property: 'on_fire' | 'sneaking' | 'in_water' }
  | { kind: 'looting_chance'; base: number; bonus: number }
  | { kind: 'inverted'; inner: LootCondition };

export interface LootCtx {
  rand: () => number;
  killedByPlayer: boolean;
  entityOnFire: boolean;
  entitySneaking: boolean;
  entityInWater: boolean;
  lootingLevel: number;
}

export function evaluate(c: LootCondition, ctx: LootCtx): boolean {
  switch (c.kind) {
    case 'random_chance':
      return ctx.rand() < c.chance;
    case 'killed_by_player':
      return ctx.killedByPlayer;
    case 'entity_property': {
      if (c.property === 'on_fire') return ctx.entityOnFire;
      if (c.property === 'sneaking') return ctx.entitySneaking;
      return ctx.entityInWater;
    }
    case 'looting_chance': {
      const chance = c.base + c.bonus * ctx.lootingLevel;
      return ctx.rand() < chance;
    }
    case 'inverted':
      return !evaluate(c.inner, ctx);
  }
}

export function and(a: LootCondition, b: LootCondition, ctx: LootCtx): boolean {
  return evaluate(a, ctx) && evaluate(b, ctx);
}
