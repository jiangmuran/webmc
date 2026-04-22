import { describe, it, expect } from 'vitest';
import { AIR, makeState } from '@/blocks/state';
import { createDefaultRegistry } from '@/blocks/registry';
import { World } from '@/world/World';
import { classifyBlock, lookupFromWorld } from './adapter';

describe('classifyBlock', () => {
  it('air → none', () => {
    const r = createDefaultRegistry();
    expect(classifyBlock(r, AIR).kind).toBe('none');
  });

  it('redstone_dust → dust', () => {
    const r = createDefaultRegistry();
    const id = r.byName('webmc:redstone_dust');
    expect(id).toBeDefined();
    if (id === undefined) return;
    expect(classifyBlock(r, makeState(id, 0)).kind).toBe('dust');
  });

  it('lever → lever', () => {
    const r = createDefaultRegistry();
    const id = r.byName('webmc:lever');
    if (id === undefined) return;
    expect(classifyBlock(r, makeState(id, 0)).kind).toBe('lever');
  });

  it('oak_door → door', () => {
    const r = createDefaultRegistry();
    const id = r.byName('webmc:oak_door');
    if (id === undefined) return;
    expect(classifyBlock(r, makeState(id, 0)).kind).toBe('door');
  });

  it('opaque stone → conductor (for redstone purposes)', () => {
    const r = createDefaultRegistry();
    const id = r.byName('webmc:stone');
    if (id === undefined) return;
    expect(classifyBlock(r, makeState(id, 0)).kind).toBe('conductor');
  });
});

describe('lookupFromWorld', () => {
  it('returns redstone-kind for the world block at (x,y,z)', () => {
    const r = createDefaultRegistry();
    const w = new World();
    const id = r.byName('webmc:lever');
    if (id === undefined) return;
    w.set(3, 40, 3, makeState(id, 0));
    const look = lookupFromWorld(w, r);
    expect(look(3, 40, 3).kind).toBe('lever');
    expect(look(0, 40, 0).kind).toBe('none');
  });
});
