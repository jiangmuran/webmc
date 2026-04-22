import { type BlockState, AIR, stateId } from '@/blocks/state';
import type { BlockRegistry } from '@/blocks/registry';
import type { World } from '@/world/World';
import type { BlockLookup, RedstoneBlock, RedstoneKind } from './signal';

const KIND_BY_NAME: Record<string, RedstoneKind> = {
  'webmc:redstone_dust': 'dust',
  'webmc:redstone_torch': 'torch',
  'webmc:lever': 'lever',
  'webmc:stone_button': 'button',
  'webmc:oak_pressure_plate': 'pressure_plate',
  'webmc:oak_door': 'door',
  'webmc:oak_trapdoor': 'door',
};

export function classifyBlock(registry: BlockRegistry, state: BlockState): RedstoneBlock {
  if (state === AIR) return { kind: 'none', opaque: false };
  const def = registry.get(stateId(state));
  const kind = KIND_BY_NAME[def.name];
  if (kind) return { kind, opaque: def.opaque };
  if (def.opaque) return { kind: 'conductor', opaque: true };
  return { kind: 'none', opaque: def.opaque };
}

export function lookupFromWorld(world: World, registry: BlockRegistry): BlockLookup {
  return (x, y, z) => classifyBlock(registry, world.get(x, y, z));
}
