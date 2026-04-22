import { describe, it, expect } from 'vitest';
import { breakPot, craftPot } from './pot_craft';

describe('decorated pot', () => {
  it('4 bricks = plain pot', () => {
    const r = craftPot({
      north: 'webmc:brick',
      south: 'webmc:brick',
      east: 'webmc:brick',
      west: 'webmc:brick',
    });
    expect(r.kind).toBe('plain_pot');
  });

  it('any sherd = decorated pot', () => {
    const r = craftPot({
      north: 'webmc:archer_pottery_sherd',
      south: 'webmc:brick',
      east: 'webmc:brick',
      west: 'webmc:brick',
    });
    expect(r.kind).toBe('decorated_pot');
  });

  it('pickaxe break drops pot', () => {
    const faces = {
      north: 'webmc:brick' as const,
      south: 'webmc:brick' as const,
      east: 'webmc:brick' as const,
      west: 'webmc:brick' as const,
    };
    const r = breakPot({ withPickaxe: true, faces });
    expect(r.drops.length).toBe(1);
    expect(r.drops[0]?.item).toBe('webmc:decorated_pot');
  });

  it('hand break drops 4 sherds', () => {
    const faces = {
      north: 'webmc:heart_pottery_sherd' as const,
      south: 'webmc:brick' as const,
      east: 'webmc:blade_pottery_sherd' as const,
      west: 'webmc:brick' as const,
    };
    const r = breakPot({ withPickaxe: false, faces });
    expect(r.drops.length).toBe(4);
    const items = r.drops.map((d) => d.item);
    expect(items).toContain('webmc:heart_pottery_sherd');
  });
});
