// Wandering trader inventory. Spawns with 5-6 one-use trades drawn from
// a rotating pool + 1 rare trade. Llamas (2 per trader) carry the leash.

import type { ItemStack } from '@/items/item';
import type { NamedStack, TradeOffer } from './villager';

interface RawOffer {
  cost: string;
  costCount: number;
  receive: string;
  receiveCount: number;
  weight: number;
  rare: boolean;
}

const POOL: readonly RawOffer[] = [
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:acacia_sapling',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:bamboo',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:cactus',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:dandelion',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:blue_orchid',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:lily_pad',
    receiveCount: 2,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:pumpkin',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:melon_seeds',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:sweet_berries',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 3,
    receive: 'webmc:sand',
    receiveCount: 8,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 1,
    receive: 'webmc:kelp',
    receiveCount: 1,
    weight: 1,
    rare: false,
  },
  {
    cost: 'webmc:emerald',
    costCount: 5,
    receive: 'webmc:podzol',
    receiveCount: 3,
    weight: 1,
    rare: true,
  },
  {
    cost: 'webmc:emerald',
    costCount: 3,
    receive: 'webmc:packed_ice',
    receiveCount: 1,
    weight: 1,
    rare: true,
  },
  {
    cost: 'webmc:emerald',
    costCount: 6,
    receive: 'webmc:blue_ice',
    receiveCount: 1,
    weight: 1,
    rare: true,
  },
];

function stackName(name: string, count: number): NamedStack {
  return { itemId: -1, count, damage: 0, __name: name };
}

export function rollWanderingTraderOffers(
  rng: () => number = Math.random,
  resolveId: (name: string) => number | undefined,
): TradeOffer[] {
  const common = POOL.filter((o) => !o.rare);
  const rare = POOL.filter((o) => o.rare);
  const picks: RawOffer[] = [];
  const shuffle = <T>(arr: readonly T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const a = copy[i];
      const b = copy[j];
      if (a === undefined || b === undefined) continue;
      copy[i] = b;
      copy[j] = a;
    }
    return copy;
  };
  picks.push(...shuffle(common).slice(0, 5));
  if (rare.length > 0) {
    const first = shuffle(rare)[0];
    if (first) picks.push(first);
  }

  const toStack = (s: NamedStack): ItemStack => {
    const id = resolveId(s.__name ?? '') ?? 0;
    return { itemId: id, count: s.count, damage: 0 };
  };

  return picks.map((p) => ({
    input: [toStack(stackName(p.cost, p.costCount))],
    output: toStack(stackName(p.receive, p.receiveCount)),
    uses: 0,
    maxUses: 1,
    priceMultiplier: 0,
    locked: false,
  }));
}
