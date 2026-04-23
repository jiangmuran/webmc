import { describe, it, expect } from 'vitest';
import { effectiveOrder, resolvedAsset, togglePack } from './resource_pack_stack';

const packs = [
  { id: 'vanilla', priority: 0, enabled: true },
  { id: 'topper', priority: 100, enabled: true },
  { id: 'disabled', priority: 50, enabled: false },
];

describe('resource pack stack', () => {
  it('higher priority first', () => {
    expect(effectiveOrder(packs)[0]?.id).toBe('topper');
  });

  it('disabled skipped', () => {
    expect(effectiveOrder(packs).every((p) => p.enabled)).toBe(true);
  });

  it('resolved = top', () => {
    expect(resolvedAsset(packs, 'textures/block/stone.png')).toBe('topper');
  });

  it('toggle flip', () => {
    const t = togglePack(packs, 'topper');
    expect(t.find((p) => p.id === 'topper')?.enabled).toBe(false);
  });
});
